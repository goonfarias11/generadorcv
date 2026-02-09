"use client";

import { useState } from "react";

interface DeployActionProps {
  specId: string;
  deployStatus?: string | null;
  deployUrl?: string | null;
}

interface DeployResponse {
  status: "accepted" | "rejected";
  url?: string;
  reason?: string;
}

export function DeployAction({ specId, deployStatus, deployUrl }: DeployActionProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [url, setUrl] = useState(deployUrl ?? "");

  const handleDeploy = async () => {
    setStatus("loading");
    setError("");

    const res = await fetch(`/api/deploy/${specId}`, { method: "POST" });
    const data = (await res.json()) as DeployResponse;

    if (!res.ok || data.status === "rejected" || !data.url) {
      setStatus("error");
      setError(data.reason ?? "No se pudo desplegar.");
      return;
    }

    setUrl(data.url);
    setStatus("idle");
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deploy</p>
          <p className="mt-2">Estado: {deployStatus ?? "pending"}</p>
        </div>
        {url ? (
          <a
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Ver sitio online
          </a>
        ) : (
          <button
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
            onClick={handleDeploy}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Publicando..." : "Publicar sitio"}
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      {url && (
        <p className="mt-3 text-xs text-slate-400">
          Este es un entorno inicial. Dominio custom disponible como upgrade.
        </p>
      )}
    </div>
  );
}
