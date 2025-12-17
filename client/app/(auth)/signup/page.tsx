"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
import Button from "../../../components/ui/Button";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574c0,0,0.001-0.001,0.002-0.001l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const RoleSelector = ({
  role,
  setRole,
}: {
  role: string;
  setRole: (role: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => setRole("mentee")}
        className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
          role === "mentee"
            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <span className="text-4xl">🎓</span>
        <span className="font-semibold mt-2 text-slate-700">I'm a Mentee</span>
        <span className="text-xs text-slate-500">Looking to learn</span>
      </button>
      <button
        type="button"
        onClick={() => setRole("mentor")}
        className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
          role === "mentor"
            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <span className="text-4xl">🧑‍🏫</span>
        <span className="font-semibold mt-2 text-slate-700">I'm a Mentor</span>
        <span className="text-xs text-slate-500">Ready to teach</span>
      </button>
    </div>
  );
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mentee");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
      // After successful registration, sign the user in directly
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login?signup=success");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800">Create an Account</h2>
      <p className="text-slate-500 mt-2">
        Join our community of learners and experts.
      </p>
      <div className="mt-8">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <GoogleIcon />
          Sign up with Google
        </button>
      </div>
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="mx-4 text-sm text-slate-400">OR</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <RoleSelector role={role} setRole={setRole} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center"
        >
          {/* You'll need to copy the Spinner component here too */}
          {isLoading && <Spinner />}
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-sky-600 hover:text-sky-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
