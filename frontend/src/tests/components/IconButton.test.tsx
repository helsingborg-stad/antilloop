import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import IconButton from "@/components/IconButton";
import { render } from "@/utils/test-utils";

describe("Icon Button", () => {
  it("Should show icon button", async () => {
    render(
      <IconButton data-testid="test-button" icon="arrow-right" a11y="test" />
    );
    expect(document.querySelector("svg")).toBeTruthy();
  });

  it("Should show white icon button", async () => {
    render(
      <IconButton
        data-testid="test-button"
        icon="arrow-right"
        variant="white"
        a11y="test"
      />
    );
    const button = screen.getByTestId("test-button");
    expect(button.className).toContain("bg-white");
  });

  it("Should show grey icon button", async () => {
    render(
      <IconButton
        data-testid="test-button"
        icon="arrow-right"
        variant="grey"
        a11y="test"
      />
    );
    const button = screen.getByTestId("test-button");
    expect(button.className).toContain("bg-grey-100");
  });

  it("Should show grey transparent icon button", async () => {
    render(
      <IconButton
        data-testid="test-button"
        icon="arrow-right"
        variant="greyTransparent"
        a11y="test"
      />
    );
    const button = screen.getByTestId("test-button");
    expect(button.className).toContain("bg-grey-700-8");
  });

  // it("Should show secondary button", async () => {
  //   render(
  //     <Button data-testid="test-button" variant="secondary">
  //       button
  //     </Button>
  //   );

  //   const button = screen.getByTestId("test-button");

  //   expect(button.className).toContain("bg-blue-50");
  //   expect(screen.getByText("button")).toBeTruthy();
  // });

  // it("Should show transparent button", async () => {
  //   render(
  //     <Button data-testid="test-button" variant="transparent">
  //       button
  //     </Button>
  //   );

  //   const button = screen.getByTestId("test-button");

  //   expect(button.className).toContain("text-blue-500");
  //   expect(screen.getByText("button")).toBeTruthy();
  // });

  // it("Should show disabled button", async () => {
  //   render(
  //     <Button data-testid="test-button" disabled>
  //       button
  //     </Button>
  //   );

  //   const button = screen.getByTestId("test-button");

  //   expect(button).toBeDisabled();
  // });
});
