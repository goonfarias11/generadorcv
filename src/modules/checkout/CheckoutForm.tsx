"use client";

import { useState } from "react";

interface CheckoutFormProps {
  specId: string;
}

interface LeadResponse {
  status: "accepted" | "rejected";
  reason?: string;
}

export function CheckoutForm({ specId }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  const submit = async () => {
    if (!name.trim() || !email.trim()) {
      setStatus("error");
      setError("Nombre y email son obligatorios.");
      return;
    }

    setStatus("sending");
    setError("");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        specId,
        name,
        email,
        company,
        message,
      }),
    });

    const data = (await res.json()) as LeadResponse;

    if (!res.ok || data.status === "rejected") {
      setStatus("error");
      setError(data.reason ?? "No pudimos procesar la solicitud.");
      return;
    }

    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-sm text-slate-200">
        <p className="text-base font-semibold">Recibimos tu solicitud.</p>
        <p className="mt-2 text-slate-400">
          Te contactaremos para avanzar con la entrega.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Nombre</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Empresa (opcional)</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Comentario (opcional)</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </div>
      {status === "error" && (
        <p className="mt-4 text-sm text-rose-300">{error}</p>
      )}
      <button
        className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando..." : "Enviar solicitud"}
      </button>
    </div>
  );
}
