import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAgencyBilling } from "@/services/agencyBillingService";
import { listAgencyLogs } from "@/services/agencyAuditService";
import { getAgencyById, listAgencyClients, listAgencyMembers, requireAgencyRole } from "@/services/agencyService";
import { listProductSpecsByAgency } from "@/services/productSpecService";
import { AgencyMemberForm } from "@/modules/agency/AgencyMemberForm";
import { AgencyClientForm } from "@/modules/agency/AgencyClientForm";
import { AgencyBillingForm } from "@/modules/agency/AgencyBillingForm";

interface AgencyDetailPageProps {
  params: { id: string };
}

export default async function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    redirect("/client/login");
  }

  const agency = await getAgencyById(params.id);
  if (!agency) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-4xl">Agencia no encontrada.</div>
      </main>
    );
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: customerId,
      roles: ["owner", "admin", "editor", "viewer"],
    });
  } catch {
    redirect("/dashboard/agencies");
  }

  const [members, clients, specs, billing, logs] = await Promise.all([
    listAgencyMembers(params.id),
    listAgencyClients(params.id),
    listProductSpecsByAgency({ agencyId: params.id, limit: 30 }),
    getAgencyBilling(params.id),
    listAgencyLogs(params.id, 20),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agencia</p>
          <h1 className="text-2xl font-semibold">{agency.name}</h1>
          <p className="text-sm text-slate-400">Slug: {agency.slug}</p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm">
          <h2 className="text-lg font-semibold">Billing</h2>
          <p className="mt-2 text-slate-400">
            Estado: {billing?.status ?? "sin plan"} · Plan: {billing?.planId ?? "-"}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <AgencyMemberForm agencyId={agency.id} />
          <AgencyClientForm agencyId={agency.id} />
        </div>

        <AgencyBillingForm agencyId={agency.id} />

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">Specs</h2>
            <Link className="text-xs text-slate-400 underline" href={`/dashboard/specs?agencyId=${agency.id}`}>
              Ver todas
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Objetivo</th>
                  <th className="px-4 py-3">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {specs.map((spec) => (
                  <tr key={spec.id} className="text-slate-200">
                    <td className="px-4 py-3 text-xs text-slate-400">{spec.id}</td>
                    <td className="px-4 py-3">{spec.productType}</td>
                    <td className="px-4 py-3">{spec.objective}</td>
                    <td className="px-4 py-3">
                      <Link className="text-slate-300 underline" href={`/preview/${spec.id}`}>
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
                {specs.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={4}>
                      No hay specs aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">Clientes</h2>
            <span className="text-xs text-slate-400">{clients.length} clientes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Nombre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clients.map((client) => (
                  <tr key={client.id} className="text-slate-200">
                    <td className="px-4 py-3">{client.email}</td>
                    <td className="px-4 py-3">{client.name ?? "-"}</td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={2}>
                      No hay clientes aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">Miembros</h2>
            <span className="text-xs text-slate-400">{members.length} miembros</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((member) => (
                  <tr key={member.id} className="text-slate-200">
                    <td className="px-4 py-3">{member.user?.email ?? member.userId}</td>
                    <td className="px-4 py-3">{member.role}</td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={2}>
                      No hay miembros aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">Actividad</h2>
            <Link className="text-xs text-slate-400 underline" href={`/api/agencies/${agency.id}/logs/export`}>
              Exportar CSV
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="px-6 py-3 text-sm text-slate-300">
                <span className="text-slate-400">{log.createdAt.toLocaleString("es-AR")}</span>
                <span className="mx-2">·</span>
                <span>{log.action}</span>
                {log.actorId && <span className="ml-2 text-xs text-slate-500">{log.actorId}</span>}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="px-6 py-6 text-sm text-slate-400">Sin actividad.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
