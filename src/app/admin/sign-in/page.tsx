import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ setup?: string }> }) {
  const { setup } = await searchParams;
  const configured = !!process.env.DATABASE_URL;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-navy">Admin sign in</h1>
      {!configured || setup ? (
        <p className="mt-4 rounded-lg bg-sand p-4 text-sm text-muted">
          The database isn&apos;t connected yet. Add <code>DATABASE_URL</code>, <code>BETTER_AUTH_SECRET</code> and{" "}
          <code>ADMIN_EMAILS</code> to the environment, then run <code>npm run db:push</code> and{" "}
          <code>npm run db:seed</code>.
        </p>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
