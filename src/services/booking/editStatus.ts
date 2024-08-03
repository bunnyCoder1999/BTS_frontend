import { enqueueSnackbar } from "notistack";
import { request } from "../intercepter";

export const editStatus = async (status: "Pending" | "Completed", booking_id: string) => {
    const { data } = await request.patch("/booking/update", { status, booking_id });
    if (data?.error === false) enqueueSnackbar("Status updated successfully");
};
