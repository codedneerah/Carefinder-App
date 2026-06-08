import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { hospitals } from "../data/hospitals";
import { HospitalCard } from "./HospitalCard";

describe("HospitalCard", () => {
  it("renders core facility information and a detail link", () => {
    render(
      <MemoryRouter>
        <HospitalCard hospital={hospitals[0]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Lagos University Teaching Hospital",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Verified facility")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      `/hospitals/${hospitals[0].id}`,
    );
  });
});
