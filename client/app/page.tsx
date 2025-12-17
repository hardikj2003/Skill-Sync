import Link from "next/link";
import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
        Welcome to SkillSync
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        Your AI-Powered micro-mentorship platform. Connect with experts, get
        instant feedback, and track your growth.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/login" className="w-32">
          <Button>Login</Button>
        </Link>
        <Link href="/signup" className="w-32">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/dashboard" className="w-32">
          <Button>Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
