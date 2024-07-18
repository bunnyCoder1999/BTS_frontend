import { GridColDef } from "@mui/x-data-grid";
import { Booking } from "./types";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";

export const columns: (
    onDelete: (b: Booking) => void,
    onEdit: (b: Booking) => void,
) => GridColDef<Booking>[] = (onDelete, onEdit) => [
    {
        field: "sl_no",
        headerName: "Sl No",
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        width: 70,
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
        field: "vehicle_number",
        headerName: "Vehicle Number",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => `${row.vehicle.number} ${row.forced ? "(F)" : ""}`,
    },
    {
        field: "vehicle_name",
        headerName: "Driver name",
        flex: 1,
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => row.vehicle.driver_name || "--",
    },
    {
        field: "status",
        headerName: "Status",
        headerClassName: "list_table_header",
        resizable: false,
        disableColumnMenu: true,
        width: 150,
        renderCell: value => {
            return (
                <div className="status_container">
                    <button
                        className={"status" + " " + value.row.status?.replace(" ", "")}
                        onClick={() => onEdit(value.row)}
                    >
                        {value.row.status}
                    </button>
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
