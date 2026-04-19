import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    const user = useApp.getState().currentUser;
    if (!user) {
      throw redirect({ to: "/" });
    }
  },
  component: AppShell,
});
