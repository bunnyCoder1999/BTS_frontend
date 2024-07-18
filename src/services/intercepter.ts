import axios from "axios";
import { enqueueSnackbar } from "notistack";

export const request = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ENTRYPOINT,
    headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use(request => {
    const cancelTokenSource = axios.CancelToken.source();
    if (sessionStorage.getItem("pass_key") !== import.meta.env.VITE_APP_PASS_KEY) {
        cancelTokenSource.cancel("Eda mwone kali venda ketto");
        request.cancelToken = cancelTokenSource.token;
    }
    return request;
});

request.interceptors.response.use(undefined, function (e) {
    enqueueSnackbar(e?.response?.data?.message || e?.toString?.(), { variant: "error" });
    return e?.response;
});
