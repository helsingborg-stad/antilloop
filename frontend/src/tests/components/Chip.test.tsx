import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import Chip from "@/components/Chip";
import { render } from "@/utils/test-utils";

describe("Chip", () => {
  it("Should show active chip", async () => {
    render(<Chip label="chip" variant="active" />);

    const chip = screen.getByText("chip");

    expect(chip.className).toContain("bg-lime-300");
    expect(screen).toBeTruthy();
  });

  it("Should show inactive chip", async () => {
    render(<Chip label="chip" variant="inactive" />);

    const chip = screen.getByText("chip");

    expect(chip.className).toContain("bg-white");
    expect(screen).toBeTruthy();
  });

  it("Should show active on surface chip", async () => {
    render(<Chip label="chip" onActiveSurface variant="active" />);

    const chip = screen.getByText("chip");

    expect(chip.className).toContain("bg-lime-900-12");
    expect(screen).toBeTruthy();
  });
});
