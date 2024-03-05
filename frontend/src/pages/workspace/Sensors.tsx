import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import useMediaQuery from "@mui/material/useMediaQuery";

import Table from "@/components/workspace/Table";
import TablePagination from "@/components/workspace/TablePagination";
import Icon from "@/components/Icon";

import { getSensors } from "@/api/school";
import { Sensor, Meta } from "@/types/school";
import Chip from "@/components/Chip";

const Sensors = () => {
  const [t] = useTranslation();
  const matches = useMediaQuery("(min-width:640px)");

  const { schoolId } = useParams<{ schoolId: string }>();

  const [page, setPage] = useState(1);

  const { data } = useQuery<{ data: Sensor[]; meta: Meta }>({
    queryKey: ["sensors", schoolId, page],
    queryFn: () => getSensors({ schoolId, page })
  });

  const columns = [
    { label: t("name"), className: "w-[40%]" },
    { label: t("location") },
    { label: t("battery") },
    { label: t("status") }
  ];

  const nextPage = () => data?.meta.next_page && setPage(data?.meta.next_page);
  const prevPage = () => data?.meta.prev_page && setPage(data?.meta.prev_page);

  return (
    <main className="flex w-full flex-grow flex-col overflow-hidden rounded-2xl bg-white lg:max-h-[calc(100vh-104px)]">
      <h1 className="p-4 text-[22px] font-medium ">{t("sensors")}</h1>

      {matches ? (
        <Table
          tableName={t("a11y.sensors_table")}
          columns={columns}
          nextPage={nextPage}
          prevPage={prevPage}
          meta={data?.meta}
        >
          {data?.data.map((sensor, index) => (
            <TableRow key={index} hover>
              <TableCell component="th" scope="row">
                <div className="flex items-center gap-5 font-medium">
                  <Icon
                    aria-hidden="true"
                    className="flex-shrink-0"
                    name="sensor"
                  />{" "}
                  {sensor.name}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-grey-400">{sensor.location}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon aria-hidden="true" name="battery" />
                  <span className="text-grey-400">{`${sensor.battery_level}%`}</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip variant={sensor.status} label={t(sensor.status)} />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : (
        <>
          <div>
            {data?.data.map((sensor, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border-b border-secondary px-4 py-2"
              >
                <Icon className="shrink-0" name="sensor" />
                <div className=" flex-grow overflow-hidden pl-2">
                  <p className="truncate font-medium">{sensor.name}</p>
                  <p className="truncate text-sm text-grey-400">
                    {sensor.location}
                  </p>
                  <div className="flex items-center gap-1">
                    <Icon name="battery" />
                    <span className="text-grey-400">{`${sensor.battery_level}%`}</span>
                  </div>
                </div>
                <Chip variant={sensor.status} label={t(sensor.status)} />
              </div>
            ))}
          </div>

          <TablePagination
            meta={data?.meta}
            nextPage={nextPage}
            prevPage={prevPage}
            a11yLabel={t("a11y.sensors_table")}
          />
        </>
      )}
    </main>
  );
};

export default Sensors;
