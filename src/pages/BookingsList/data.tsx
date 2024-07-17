import { GridColDef } from "@mui/x-data-grid";
import { Booking } from "./types";
import dayjs from "dayjs";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";

export const columns: (onDelete: (b: Booking) => void) => GridColDef<Booking>[] = onDelete => [
    {
        field: "date",
        headerName: "Date",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => dayjs(row.date).format("DD/MM/YYYY"),
    },
    {
        field: "booking_id",
        headerName: "Booking ID",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
    },
    {
        field: "name",
        headerName: "Name",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
    },
    {
        field: "vehicle",
        headerName: "Vehicle Number",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => row.vehicle.number,
    },
    {
        field: "status",
        headerName: "Status",
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        width: 150,
        renderCell: value => {
            const completed = dayjs(value.row.date).isBefore(dayjs().startOf("day"));
            const inProgress = dayjs(value.row.date).isSame(dayjs().startOf("day"));
            return (
                <div className="status_container">
                    <div className={"status" + (inProgress ? " progress" : !completed ? " pending" : "")}>
                        {inProgress ? "In Progress" : completed ? "Completed" : "Pending"}
                    </div>
                </div>
            );
        },
    },
    {
        field: "action",
        headerName: "Action",
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        width: 70,
        renderCell: value => {
            return (
                <IconButton onClick={() => onDelete(value.row)}>
                    <MdDelete fill="red" />
                </IconButton>
            );
        },
    },
];
