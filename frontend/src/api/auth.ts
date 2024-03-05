import request from "@/utils/request";

const login = (data: { email: string; name: string }) =>
  request({
    method: "post",
    url: "/api/v1/user_accounts/sign_in",
    data
  }).then((res) => res.data.data);

const me = () =>
  request({ method: "get", url: "/api/v1/user_accounts/show" }).then(
    (res) => res.data.data
  );

export { login, me };
