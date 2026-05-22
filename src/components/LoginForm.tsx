"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/actions/authActions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/20"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Giriş yapılıyor...
        </span>
      ) : (
        "Giriş Yap"
      )}
    </button>
  );
}

export function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          E-posta Adresi
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="admin@ags.com"
          placeholder="admin@ags.com"
          className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/5 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
        />
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
          {errorMessage}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
