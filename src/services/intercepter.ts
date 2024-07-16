import axios from "axios";
import { enqueueSnackbar } from "notistack";

export const request = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ENTRYPOINT,
    headers: { "Content-Type": "application/json" },
});

request.interceptors.response.use(undefined, function (e) {
    enqueueSnackbar(e?.response?.data?.message || e?.toString?.(), { variant: "error" });
    return e?.response;
});
