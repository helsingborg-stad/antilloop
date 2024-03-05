import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import { render } from "@/utils/test-utils";

describe("Tooltip", () => {
  it("Should show active chip", async () => {
    render(
      <Tooltip title="tooltip" open={true}>
        <Button>test</Button>
      </Tooltip>
    );
    expect(screen.getByText("tooltip")).toBeTruthy();
  });
});
