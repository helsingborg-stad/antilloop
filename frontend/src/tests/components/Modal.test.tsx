import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";

import Modal from "@/components/Modal";
import { render } from "@/utils/test-utils";
import i18n from "@/i18n";

describe("Modal", () => {
  it("Should render modal", async () => {
    render(
      <Modal
        open={true}
        title="title"
        testId="modal"
        toggleModal={() => console}
      >
        content
      </Modal>
    );

    const close = document.querySelector("button");

    expect(close).toHaveAttribute(
      "aria-label",
      i18n.t("a11y.buttons.close_modal")
    );

    expect(screen.getByText("content")).toBeTruthy();
  });

  it("Should render modal with action", async () => {
    render(
      <Modal
        open={true}
        title="title"
        testId="modal"
        toggleModal={() => console}
        action={() => console}
        actionTitle="action"
      >
        content
      </Modal>
    );

    const close = document.querySelector("button");

    expect(close).toHaveAttribute(
      "aria-label",
      i18n.t("a11y.buttons.close_modal")
    );

    expect(screen.getByText("action")).toBeTruthy();
  });
});
