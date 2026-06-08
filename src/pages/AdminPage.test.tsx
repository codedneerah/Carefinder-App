import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../lib/supabase", () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

import { AdminPage } from "./AdminPage";

describe("AdminPage", () => {
  it("requires sign-in before showing directory controls", () => {
    render(<AdminPage />);
    expect(screen.getByText("Protected dashboard")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("admin@carefinder.ng"), {
      target: { value: "admin@carefinder.ng" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Directory overview")).toBeInTheDocument();
  });
});
