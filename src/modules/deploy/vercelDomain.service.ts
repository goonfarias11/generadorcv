interface VercelDomainResponse {
  verified?: boolean;
  error?: { message?: string };
}

const vercelApiUrl = "https://api.vercel.com/v9";

const getAuthHeaders = () => {
  const token = process.env.VERCEL_TOKEN ?? "";
  if (!token) {
    throw new Error("Vercel no configurado");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function addDomainToProject(input: {
  projectName: string;
  domain: string;
}) {
  const res = await fetch(
    `${vercelApiUrl}/projects/${input.projectName}/domains`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: input.domain }),
    }
  );

  const data = (await res.json()) as VercelDomainResponse;

  if (!res.ok) {
    throw new Error(data.error?.message ?? "Error al registrar dominio");
  }

  return data;
}

export async function getDomainStatus(input: {
  projectName: string;
  domain: string;
}) {
  const res = await fetch(
    `${vercelApiUrl}/projects/${input.projectName}/domains/${input.domain}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = (await res.json()) as VercelDomainResponse;

  if (!res.ok) {
    throw new Error(data.error?.message ?? "Error al verificar dominio");
  }

  return data;
}
