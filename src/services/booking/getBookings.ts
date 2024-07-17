import { Booking } from "../../pages/BookingsList/types";
import { request } from "../intercepter";

export const getBookings = async (date?: string) => {
    const bookings = { Brahmapuram: [] as Booking[], Willington: [] as Booking[] };
    const { data } = await request.get("/booking", { params: { date } });
    const bookingsData = (data?.data || []) as Booking[];
    bookingsData.map(ele => bookings?.[ele?.plant]?.push({ ...ele, id: ele.vehicle.number }));
    return bookings;
};
