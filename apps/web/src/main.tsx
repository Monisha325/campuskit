import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@campuskit/ui";
import "@campuskit/tokens/styles.css";
import { AuthProvider } from "./auth";
import { AppRoutes } from "./routes";
import "./styles.scss";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

createRoot(document.getElementById("root")!).render(
  <StrictMode><QueryClientProvider client={queryClient}><AuthProvider><ToastProvider><BrowserRouter><AppRoutes /></BrowserRouter></ToastProvider></AuthProvider></QueryClientProvider></StrictMode>
);
