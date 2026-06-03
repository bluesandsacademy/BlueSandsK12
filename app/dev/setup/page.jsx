import { notFound } from "next/navigation";
import CreateAdminForm from "./create-admin-form";

export default function DevSetupPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Dev badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono font-semibold tracking-wide uppercase">
            Development only
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Create Blog Admin</h1>
            <p className="text-sm text-gray-400 mt-1">
              Creates a Supabase auth user with email already confirmed.
              This page does not exist in production.
            </p>
          </div>

          <CreateAdminForm />
        </div>

        <p className="text-center text-xs text-gray-600 mt-4 font-mono">
          /dev/setup · NODE_ENV=development
        </p>
      </div>
    </div>
  );
}
