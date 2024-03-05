import axios from "axios";
import { getCookieByName } from "./cookieProvider";

const token = getCookieByName("antiloop_token");

const locale = localStorage.getItem("antiloop_locale") || "sv";

const headers = token
  ? {
      headers: {
        Authorization: token
      }
    }
  : {};

const client = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI,
  ...headers,
  params: {
    locale
  }
});

export default client;
