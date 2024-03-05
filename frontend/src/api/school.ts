import { Integration } from "@/types/school";
import request from "@/utils/request";

const getSchools = () =>
  request({
    method: "get",
    url: "/api/v1/schools"
  }).then((res) => res.data.data);

const getSensors = ({ schoolId, page }: { schoolId?: string; page: number }) =>
  request({
    method: "get",
    url: `/api/v1/workspace/schools/${schoolId}/sensors`,
    params: { page, per_page: 15 }
  }).then((res) => res.data);

const getIntegrations = ({ schoolId }: { schoolId?: string }) =>
  request({
    method: "get",
    url: `/api/v1/workspace/schools/${schoolId}/integrations`
  }).then((res) => res.data.data);

const createIntegration = ({
  schoolId,
  integrationId,
  settings
}: {
  schoolId?: string;
  integrationId: number;
  settings: Integration["settings"];
}) =>
  request({
    method: "post",
    url: `/api/v1/workspace/schools/${schoolId}/integrations/${integrationId}/school_integrations`,
    data: { settings }
  }).then((res) => res.data.data);

const updateIntegration = ({
  integrationId,
  status,
  settings
}: {
  integrationId: number;
  status?: string;
  settings: Integration["settings"];
}) =>
  request({
    method: "put",
    url: `/api/v1/workspace/school_integrations/${integrationId}`,
    data: { settings, status }
  }).then((res) => res.data.data);

const getSchoolSettings = ({ schoolId }: { schoolId?: string }) =>
  request({
    method: "get",
    url: `/api/v1/workspace/schools/${schoolId}`
  }).then((res) => res.data);

const getWidgetData = ({
  id,
  from,
  to
}: {
  from?: string;
  to?: string;
  id?: number;
}) =>
  request({
    method: "get",
    url: `/api/v1/widgets/${id}/data`,
    params: { from, to }
  })
    .then((res) => res.data.data)
    .catch((err) => Promise.reject(err));

const getWidgetLatestData = ({ id }: { id?: number }) =>
  request({
    method: "get",
    url: `/api/v1/widgets/${id}/latest_data`
  })
    .then((res) => res.data.data)
    .catch((err) => Promise.reject(err));

const getSchoolDashboard = ({ schoolId }: { schoolId?: string }) =>
  request({
    method: "get",
    url: `/api/v1/schools/${schoolId}/home_page`
  }).then((res) => res.data.data);

const getSchool = ({ schoolId }: { schoolId?: string }) =>
  request({
    method: "get",
    url: `/api/v1/schools/${schoolId}`
  })
    .then((res) => res.data.data)
    .catch((err) => Promise.reject(err));

const getSchoolPage = ({
  pageId,
  sectionId
}: {
  pageId?: string;
  sectionId?: string;
}) =>
  request({
    method: "get",
    url: `/api/v1/pages/${pageId}/sections/${sectionId}`
  })
    .then((res) => res.data.data)
    .catch((err) => Promise.reject(err));

const getSchoolOverview = ({ schoolId }: { schoolId?: string }) =>
  request({
    method: "get",
    url: `/api/v1/schools/${schoolId}/home_page/overview`
  }).then((res) => res.data.data);

export {
  getSchools,
  getSchool,
  getSensors,
  getIntegrations,
  updateIntegration,
  createIntegration,
  getWidgetData,
  getWidgetLatestData,
  getSchoolDashboard,
  getSchoolPage,
  getSchoolOverview,
  getSchoolSettings
};
