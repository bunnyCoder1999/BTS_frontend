export type Booking = {
    vehicle: {
        number: string;
        driver_name: string;
    };
    name: string;
    date: string;
    plant: "Brahmapuram" | "Willington";
    booking_id: string;
    id: string;
    status?: string;
    sl_no?: string;
    forced?: boolean;
    comment?: { commented_on: Date | string; text: string };
};
