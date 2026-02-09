"use client";

import { useState } from "react";

interface LoginResponse {
  status: "accepted" | "rejected";
  magicLink?: string;
  reason?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);

  const submit = async () => {
    setStatus("loading");
    setMessage(null);
    setMagicLink(null);

    const res = await fetch("/api/client/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as LoginResponse;

    if (!res.ok || data.status === "rejected") {
      setStatus("error");
      setMessage(data.reason ?? "No pudimos iniciar sesión.");
      return;
    }

    setStatus("done");
    setMessage("Te enviamos un link mágico. También podés usar este enlace:");
    setMagicLink(data.magicLink ?? null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h1 className="text-2xl font-semibold">Acceso de cliente</h1>
      <p className="mt-2 text-slate-400">Ingresá tu email para recibir el link mágico.</p>
      <input
        className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200"
        placeholder="tu@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        required
      />
      {message && <p className="mt-3 text-xs text-slate-300">{message}</p>}
      {magicLink && (
        <a
          className="mt-3 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-950"
          href={magicLink}
        >
          Entrar al panel
        </a>
      )}
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{message}</p>}
      <button
        className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar link"}
      </button>
    </div>
  );
}
