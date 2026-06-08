import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DirectoryPage } from "./DirectoryPage";

describe("DirectoryPage", () => {
  it("loads active URL filters and shows matching results", () => {
    render(
      <MemoryRouter initialEntries={["/hospitals?state=FCT"]}>
        <DirectoryPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("2 facilities found")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cedarcrest Hospitals" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Evercare Hospital Lekki" })).not.toBeInTheDocument();
  });
});
