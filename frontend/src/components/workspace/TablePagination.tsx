import { FC } from "react";
import { useTranslation } from "react-i18next";

import IconButton from "@/components/IconButton";

import { Meta } from "@/types/school";

interface TablePaginationProps {
  meta?: Meta;
  nextPage: () => void;
  prevPage: () => void;
  a11yLabel: string;
}

const perPage = 15;

const TablePagination: FC<TablePaginationProps> = ({
  meta,
  nextPage,
  prevPage,
  a11yLabel
}) => {
  const [t] = useTranslation();

  return (
    <>
      {meta && (
        <div className="bottom-0 flex w-full items-center justify-end gap-6 bg-white sm:sticky">
          <p className="text-xs tracking-wide">
            {t("current_number_of_total", {
              total: meta.total_count,
              current:
                meta.current_page && meta.total_count < perPage
                  ? `1-${meta.total_count}`
                  : `${(meta.current_page - 1) * perPage + 1}-${
                      meta.next_page
                        ? meta.current_page * perPage
                        : meta.total_count
                    }`
            })}
          </p>
          <div>
            <IconButton
              disabled={!meta?.prev_page}
              onClick={prevPage}
              size="large"
              icon="arrow-left"
              a11y={`${a11yLabel} ${t("a11y.buttons.prev_page")}`}
            />
            <IconButton
              disabled={!meta?.next_page}
              onClick={nextPage}
              size="large"
              icon="arrow-right"
              a11y={`${a11yLabel} ${t("a11y.buttons.next_page")}`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TablePagination;
