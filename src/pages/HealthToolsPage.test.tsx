import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HealthToolsPage } from "./HealthToolsPage";

describe("HealthToolsPage", () => {
  it("explains a selected test after a value is entered", () => {
    render(
      <MemoryRouter>
        <HealthToolsPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText("Enter value"), {
      target: { value: "11.2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Explain this result" }));
    expect(screen.getByText("11.2")).toBeInTheDocument();
    expect(screen.getByText(/carries oxygen around your body/i)).toBeInTheDocument();
  });
});
