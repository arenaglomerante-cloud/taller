"use client";

import { useState } from "react";

type ApiStatus = {
  initialized: boolean;
  connected: boolean;
  ready: boolean;
  qr: string | null;
  qrAvailable: boolean;
  sessionPath: string;
  lastError: string | null;
};

export default function WhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const init = async () => {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/whatsapp/init", { method: "POST" });
      const data = (await response.json()) as
        | { ok: true; status: ApiStatus }
        | { ok: false; error: string };

      if (!data.ok) {
        setResult(data.error);
        return;
      }

      setStatus(data.status);
      setResult(
        data.status.qrAvailable
          ? "Escanea el QR mostrado abajo o en la consola del servidor"
          : "Inicializado"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status");
      const data = (await response.json()) as
        | { ok: true; status: ApiStatus }
        | { ok: false; error: string };
      if (!data.ok) {
        setResult(data.error);
        return;
      }
      setStatus(data.status);
    } catch (error) {
      console.error("Error consultando estado de WhatsApp", error);
      setResult("No fue posible consultar el estado");
    }
  };

  const send = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      });
      const data = (await response.json()) as
        | { ok: true; sent: { id?: string; to: string } }
        | { ok: false; error: string };

      if (!data.ok) {
        setResult(data.error);
        return;
      }

      setResult(`Mensaje enviado a ${data.sent.to}`);
      setMessage("");
    } finally {
      setLoading(false);
      await refreshStatus();
    }
  };

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">Prueba de WhatsApp Web.js</h1>

      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="mb-2 text-sm">Estado: {status?.ready ? "Listo" : "No conectado"}</div>
        <div className="mb-2 text-sm">Sesión: {status?.sessionPath ?? "-"}</div>
        {status?.lastError ? <p className="text-sm text-red-600">{status.lastError}</p> : null}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={init}
            disabled={loading}
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            Inicializar conexión
          </button>
          <button
            type="button"
            onClick={refreshStatus}
            className="rounded border border-zinc-300 px-3 py-2 text-sm"
          >
            Ver estado
          </button>
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
        <label className="mb-2 block text-sm font-medium">Teléfono internacional</label>
        <input
          className="mb-3 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+51999111222"
        />

        <label className="mb-2 block text-sm font-medium">Mensaje</label>
        <textarea
          className="mb-3 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Hola desde TallerFlow"
        />

        <button
          type="button"
          disabled={loading}
          onClick={send}
          className="rounded bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Enviar mensaje
        </button>
      </div>

      {result ? <p className="text-sm text-zinc-700 dark:text-zinc-300">{result}</p> : null}

      {status?.qr ? (
        <pre className="overflow-auto rounded bg-zinc-900 p-3 text-xs text-zinc-100">
          {status.qr}
        </pre>
      ) : null}
    </main>
  );
}
