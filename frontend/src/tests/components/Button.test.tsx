import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import Button from "@/components/Button";
import { render } from "@/utils/test-utils";

describe("Button", () => {
  it("Should show primary button", async () => {
    render(
      <Button data-testid="test-button" variant="primary">
        button
      </Button>
    );

    const button = screen.getByTestId("test-button");

    expect(button.className).toContain("bg-blue-500");
    expect(screen.getByText("button")).toBeTruthy();
  });

  it("Should show secondary button", async () => {
    render(
      <Button data-testid="test-button" variant="secondary">
        button
      </Button>
    );

    const button = screen.getByTestId("test-button");

    expect(button.className).toContain("bg-blue-50");
    expect(screen.getByText("button")).toBeTruthy();
  });

  it("Should show transparent button", async () => {
    render(
      <Button data-testid="test-button" variant="transparent">
        button
      </Button>
    );

    const button = screen.getByTestId("test-button");

    expect(button.className).toContain("text-blue-500");
    expect(screen.getByText("button")).toBeTruthy();
  });

  it("Should show disabled button", async () => {
    render(
      <Button data-testid="test-button" disabled>
        button
      </Button>
    );

    const button = screen.getByTestId("test-button");

    expect(button).toBeDisabled();
  });
});
