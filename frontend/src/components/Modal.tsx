import { FC } from "react";
import { useTranslation } from "react-i18next";
import { default as MuiModal } from "@mui/material/Modal";
import Button from "./Button";

import IconButton from "./IconButton";

interface ModalProps {
  open: boolean;
  title: string;
  action?: () => void;
  actionTitle?: string;
  toggleModal: () => void;
  children?: React.ReactNode;
  testId: string;
}

const Modal: FC<ModalProps> = ({
  open,
  title,
  action,
  actionTitle,
  children,
  toggleModal,
  testId
}) => {
  const [t] = useTranslation();

  return (
    <MuiModal
      open={open}
      onClose={toggleModal}
      aria-labelledby={`${testId}-modal-title`}
      className="flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        role="document"
        className="m-6 flex-grow rounded-32 bg-white shadow-material-l sm:m-0 sm:flex-grow-0"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 id={`${testId}-modal-title`} className="text-2xl font-semibold">
            {title}
          </h2>

          <IconButton
            className="-mr-3"
            icon="close"
            onClick={toggleModal}
            a11y={t("a11y.buttons.close_modal")}
          />
        </div>
        <div className="px-6 py-4 sm:px-10">{children}</div>
        {!!action && !!actionTitle && (
          <div className="flex justify-end py-6 pl-4 pr-6">
            <Button onClick={action}>{actionTitle}</Button>
          </div>
        )}
      </div>
    </MuiModal>
  );
};

export default Modal;
