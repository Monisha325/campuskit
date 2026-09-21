import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button, Card, Input } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { LoginResponse } from "../api/types";
import { useAuth } from "../auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  confirmPassword: z.string()
}).refine((values) => values.password === values.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });

type RegisterValues = z.infer<typeof registerSchema>;

export function Register() {
  const { setSession, user } = useAuth();
  const navigate = useNavigate();
  const { formState: { errors }, handleSubmit, register } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const registration = useMutation({
    mutationFn: ({ confirmPassword: _confirmPassword, ...values }: RegisterValues) => apiFetch<LoginResponse>("/auth/register", { body: JSON.stringify(values), method: "POST" }),
    onSuccess: ({ token, user: nextUser }) => { setSession(token, nextUser); navigate("/browse"); }
  });

  if (user) return <Navigate replace to="/browse" />;
  return <main className="login-page"><Card heading="Create your CampusKit account"><p className="muted">Register once to request equipment and manage your bookings.</p>
    <form className="login-form" onSubmit={handleSubmit((values) => registration.mutate(values))}>
      <Input autoComplete="name" error={errors.name?.message} label="Full name" {...register("name")} />
      <Input autoComplete="email" error={errors.email?.message} label="Email" type="email" {...register("email")} />
      <Input autoComplete="new-password" description="Use at least 8 characters." error={errors.password?.message} label="Password" type="password" {...register("password")} />
      <Input autoComplete="new-password" error={errors.confirmPassword?.message} label="Confirm password" type="password" {...register("confirmPassword")} />
      {registration.error && <p className="form-error" role="alert">{registration.error.message}</p>}
      <Button loading={registration.isPending} loadingLabel="Creating account" type="submit">Create account</Button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </Card></main>;
}
