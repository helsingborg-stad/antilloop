import { describe, expect, it } from "vitest";
import Icon from "@/components/Icon";
import { render } from "../utils/test-utils";

describe("Test", () => {
  it("Should render home page ", async () => {
    render(<Icon name="login" />);
    expect(document.querySelector("svg")).toBeTruthy();
  });
});
