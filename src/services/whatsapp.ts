import fs from "node:fs";
import path from "node:path";

import qrcode from "qrcode-terminal";
import {
  Client,
  LocalAuth,
  type ClientOptions,
  type Message,
} from "whatsapp-web.js";

type WhatsAppStatus = {
  initialized: boolean;
  connected: boolean;
  ready: boolean;
  qr: string | null;
  qrAvailable: boolean;
  sessionPath: string;
  lastError: string | null;
};

function sanitizeInternationalPhone(value: string): string {
  const cleaned = value.replace(/[\s()-]/g, "");
  if (!/^\+?[1-9]\d{7,14}$/.test(cleaned)) {
    throw new Error(
      "El teléfono debe estar en formato internacional, por ejemplo +51999111222"
    );
  }
  return cleaned.replace(/^\+/, "");
}

function parseMessageId(message: Message): string | undefined {
  if (typeof message.id === "object" && "_serialized" in message.id) {
    return message.id._serialized;
  }
  return undefined;
}

class WhatsAppService {
  private client: Client | null = null;
  private initializationPromise: Promise<void> | null = null;
  private initialized = false;
  private connected = false;
  private ready = false;
  private qr: string | null = null;
  private lastError: string | null = null;
  private prismaClientPromise:
    | Promise<(typeof import("@/lib/prisma"))["prisma"] | null>
    | null = null;

  private readonly sessionPath = path.resolve(
    process.cwd(),
    process.env.WHATSAPP_SESSION_PATH ?? "./whatsapp-session/"
  );

  private ensureSessionPath() {
    fs.mkdirSync(this.sessionPath, { recursive: true });
  }

  private getHeadlessMode() {
    const value = process.env.WHATSAPP_HEADLESS;
    if (value === undefined) {
      return true;
    }

    return value.toLowerCase() === "true";
  }

  private async getPrismaClient() {
    if (!this.prismaClientPromise) {
      this.prismaClientPromise = import("@/lib/prisma")
        .then((mod) => mod.prisma)
        .catch((error) => {
          const message =
            error instanceof Error
              ? error.message
              : "No fue posible cargar Prisma";
          this.lastError = message;
          console.error("No se pudo cargar Prisma para WhatsApp:", message);
          this.prismaClientPromise = null;
          return null;
        });
    }

    return this.prismaClientPromise;
  }

  private async persistMessage(data: {
    waMessageId?: string;
    direction: "INBOUND" | "OUTBOUND";
    from: string;
    to: string;
    body: string;
  }) {
    const prisma = await this.getPrismaClient();
    if (!prisma) {
      return;
    }

    try {
      await prisma.whatsAppMessage.create({ data });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible persistir mensaje de WhatsApp";
      this.lastError = message;
      console.error("Error guardando mensaje de WhatsApp:", message);
    }
  }

  private getClientOptions(): ClientOptions {
    return {
      authStrategy: new LocalAuth({ dataPath: this.sessionPath }),
      puppeteer: {
        headless: this.getHeadlessMode(),
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    };
  }

  private registerEvents(client: Client) {
    client.on("qr", (qr) => {
      this.qr = qr;
      this.connected = false;
      this.ready = false;
      this.lastError = null;
      qrcode.generate(qr, { small: true });
    });

    client.on("authenticated", () => {
      this.connected = true;
      this.lastError = null;
    });

    client.on("ready", () => {
      this.ready = true;
      this.connected = true;
      this.qr = null;
      this.lastError = null;
    });

    client.on("auth_failure", (message) => {
      this.connected = false;
      this.ready = false;
      this.lastError = message;
    });

    client.on("disconnected", (reason) => {
      this.connected = false;
      this.ready = false;
      this.lastError = `Conexión cerrada: ${reason}`;
    });

    client.on("message", async (message) => {
      if (message.fromMe) {
        return;
      }

      await this.persistMessage({
        waMessageId: parseMessageId(message),
        direction: "INBOUND",
        from: message.from,
        to: message.to,
        body: message.body,
      });
    });
  }

  async initialize() {
    if (this.ready) {
      return this.getStatus();
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
      return this.getStatus();
    }

    this.ensureSessionPath();

    this.initializationPromise = (async () => {
      this.client = new Client(this.getClientOptions());
      this.registerEvents(this.client);
      this.initialized = true;
      await this.client.initialize();
    })();

    try {
      await this.initializationPromise;
    } catch (error) {
      this.initialized = false;
      this.ready = false;
      this.connected = false;
      if (this.client) {
        await this.client.destroy().catch(() => undefined);
      }
      this.client = null;
      this.lastError =
        error instanceof Error
          ? error.message
          : "No fue posible iniciar WhatsApp";
      throw error;
    } finally {
      this.initializationPromise = null;
    }

    return this.getStatus();
  }

  async sendMessage(phone: string, message: string) {
    if (!this.client || !this.ready) {
      throw new Error(
        "WhatsApp no está listo. Inicializa y escanea el QR antes de enviar mensajes."
      );
    }

    const normalizedPhone = sanitizeInternationalPhone(phone);
    const chatId = `${normalizedPhone}@c.us`;
    let response: Message;

    try {
      response = await this.client.sendMessage(chatId, message);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No fue posible enviar el mensaje de WhatsApp";
      this.lastError = errorMessage;
      throw new Error(errorMessage);
    }

    await this.persistMessage({
      waMessageId: parseMessageId(response),
      direction: "OUTBOUND",
      from: this.client.info?.wid.user ?? "unknown",
      to: chatId,
      body: message,
    });

    return {
      id: parseMessageId(response),
      to: chatId,
      body: response.body,
    };
  }

  getStatus(): WhatsAppStatus {
    return {
      initialized: this.initialized,
      connected: this.connected,
      ready: this.ready,
      qr: this.qr,
      qrAvailable: Boolean(this.qr),
      sessionPath: this.sessionPath,
      lastError: this.lastError,
    };
  }
}

export const whatsappService = new WhatsAppService();
