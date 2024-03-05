import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import FilterButton from "@/components/FilterButton";
import { render } from "@/utils/test-utils";

describe("Filter Button", () => {
  it("Should show filter button", async () => {
    render(<FilterButton label="button"></FilterButton>);

    const button = screen.getByText("button");

    expect(button.className).toContain("bg-grey-100");
    expect(screen).toBeTruthy();
  });

  it("Should show filter button white", async () => {
    render(<FilterButton variant="white" label="button"></FilterButton>);

    const button = screen.getByText("button");

    expect(button.className).toContain("bg-white");
    expect(screen.getByText("button")).toBeTruthy();
  });
});
