"use client";

import { useState } from "react";

interface AIServiceToggleProps {
  id: string;
  isActive: boolean;
}

export function AIServiceToggle({ id, isActive }: AIServiceToggleProps) {
  const [active, setActive] = useState(isActive);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const toggle = async () => {
    setStatus("loading");
    const res = await fetch(`/api/ai-services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setActive((prev) => !prev);
    setStatus("idle");
  };

  return (
    <button
      className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
      onClick={toggle}
      disabled={status === "loading"}
    >
      {active ? "Activo" : "Inactivo"}
    </button>
  );
}
