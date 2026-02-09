import { LoginForm } from "@/modules/client/LoginForm";

export default function ClientLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-xl">
        <LoginForm />
      </div>
    </main>
  );
}
