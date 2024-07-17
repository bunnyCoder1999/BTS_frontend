import { enqueueSnackbar } from "notistack";
import { request } from "../intercepter";

export const deleteBooking = async (booking_id: string) => {
    const { data } = await request.delete("/booking/delete", { params: { booking_id } });
    !data.error && enqueueSnackbar(data.message || "Success");
};
