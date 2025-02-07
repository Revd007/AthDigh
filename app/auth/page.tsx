import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}