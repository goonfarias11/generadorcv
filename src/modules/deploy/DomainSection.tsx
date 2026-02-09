"use client";

import { useState } from "react";

interface DomainSectionProps {
  specId: string;
  existingDomain?: string | null;
  status?: string | null;
}

interface DomainResponse {
  status: "accepted" | "rejected";
  domain?: string;
  reason?: string;
  domainStatus?: string;
}

const dnsInstructions = {
  cname: {
    type: "CNAME",
    name: "www",
    value: "cname.vercel-dns.com",
  },
  a: {
    type: "A",
    name: "@",
    value: "76.76.21.21",
  },
};

export function DomainSection({ specId, existingDomain, status }: DomainSectionProps) {
  const [domain, setDomain] = useState(existingDomain ?? "");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [domainStatus, setDomainStatus] = useState(status ?? "pending");

  const requestDomain = async () => {
    setState("loading");
    setMessage("");

    const res = await fetch("/api/domain/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId, domain }),
    });

    const data = (await res.json()) as DomainResponse;

    if (!res.ok || data.status === "rejected") {
      setState("error");
      setMessage(data.reason ?? "No pudimos registrar el dominio.");
      return;
    }

    setDomainStatus(data.domainStatus ?? "pending");
    setState("idle");
  };

  const verifyDomain = async () => {
    setState("loading");
    setMessage("");

    const res = await fetch("/api/domain/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId }),
    });

    const data = (await res.json()) as DomainResponse;

    if (!res.ok || data.status === "rejected") {
      setState("error");
      setMessage(data.reason ?? "No pudimos verificar el dominio.");
      return;
    }

    setDomainStatus(data.domainStatus ?? "pending");
    setState("idle");
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dominio propio</p>
          <h2 className="mt-2 text-lg font-semibold">Quiero usar mi dominio</h2>
          <p className="mt-2 text-slate-400">
            Conectá tu dominio y publicamos el sitio con tu marca.
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
          Upgrade
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
          placeholder="midominio.com"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
        />
        <button
          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
          onClick={requestDomain}
          disabled={state === "loading"}
        >
          Configurar dominio
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
        <p className="text-slate-200">Configuración DNS sugerida</p>
        <p className="mt-2">CNAME {dnsInstructions.cname.name} → {dnsInstructions.cname.value}</p>
        <p className="mt-1">A {dnsInstructions.a.name} → {dnsInstructions.a.value}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
          {domainStatus}
        </span>
        <button
          className="text-xs text-slate-300 underline"
          onClick={verifyDomain}
          disabled={state === "loading"}
        >
          Verificar ahora
        </button>
        {domainStatus === "active" && domain && (
          <a
            className="text-xs text-slate-300 underline"
            href={`https://${domain}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver sitio online
          </a>
        )}
      </div>

      {message && <p className="mt-3 text-xs text-rose-300">{message}</p>}
    </section>
  );
}
