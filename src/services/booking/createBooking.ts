import { enqueueSnackbar } from "notistack";
import { vehicles } from "../../constants";
import { request } from "../intercepter";

type createBookingParams = {
    name: string;
    vehicle: (typeof vehicles)[number];
    plant: string;
    booking_id: string;
    date: string;
    status: string;
    forced: boolean;
};

export const createBooking = async (params: createBookingParams) => {
    const { data } = await request.post("/booking/create", params);
    !data.error && enqueueSnackbar(data.message || "Success");
    return data;
};
