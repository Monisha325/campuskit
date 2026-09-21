import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button, Card, Input } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { LoginResponse } from "../api/types";
import { useAuth } from "../auth";

const loginSchema = z.object({ email: z.string().email("Enter a valid email address."), password: z.string().min(1, "Enter your password.") });
type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  const { setSession, user } = useAuth();
  const navigate = useNavigate();
  const { formState: { errors }, handleSubmit, register } = useForm<LoginValues>({ defaultValues: { email: "student@test.edu", password: "Test@1234" }, resolver: zodResolver(loginSchema) });
  const login = useMutation({
    mutationFn: (values: LoginValues) => apiFetch<LoginResponse>("/auth/login", { body: JSON.stringify(values), method: "POST" }),
    onSuccess: ({ token, user: nextUser }) => { setSession(token, nextUser); navigate("/browse"); }
  });
  if (user) return <Navigate replace to="/browse" />;
  return <main className="login-page"><Card heading="Sign in to CampusKit"><p className="muted">Use the seeded student account or sign in as the demo administrator.</p>
    <form className="login-form" onSubmit={handleSubmit((values) => login.mutate(values))}>
      <Input autoComplete="email" error={errors.email?.message} label="Email" type="email" {...register("email")} />
      <Input autoComplete="current-password" error={errors.password?.message} label="Password" type="password" {...register("password")} />
      {login.error && <p className="form-error" role="alert">{login.error.message}</p>}
      <Button loading={login.isPending} loadingLabel="Signing in" type="submit">Sign in</Button>
    </form>
    <p className="auth-switch">New to CampusKit? <Link to="/register">Create an account</Link></p>
  </Card></main>;
}
