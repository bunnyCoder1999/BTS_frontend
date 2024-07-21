import { enqueueSnackbar } from "notistack";
import { request } from "../intercepter";
import { Booking } from "../../pages/BookingsList/types";

export const addComment = async (comment: Booking["comment"], booking_id: string) => {
    const { data } = await request.patch("/booking/comment", { comment, booking_id });
    if (!data?.error) enqueueSnackbar("Comment updated successfully");
};
