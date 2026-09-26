import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const { login, isLoading, error } = useAuthStore();
  const [localError, setLocalError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      await login(email, password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Failed to login");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[var(--color-surface)] rounded-xl shadow-sm border border-theme">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-theme">Super Admin Login</h1>
          <p className="text-sm text-secondary mt-2">Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {displayError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
              {displayError}
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full mt-2">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
