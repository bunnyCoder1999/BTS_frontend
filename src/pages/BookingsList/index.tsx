import { DataGrid } from "@mui/x-data-grid";
import "./style.css";
import { DatePicker } from "@mui/x-date-pickers";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Booking } from "./types";
import { columns } from "./data";
import { keys, plants, vehicles } from "../../constants";
import { deleteBooking, editStatus, getBookings } from "../../services";
import ExcelJS from "exceljs";
import { MdDelete } from "react-icons/md";
import { useDebounce } from "../../utils";

const BookingList = () => {
    const [bookings, setBookings] = useState({ Brahmapuram: [] as Booking[], Willington: [] as Booking[] });
    const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        key: "" as keyof Booking,
        query: "",
        vehicle: null as unknown as (typeof vehicles)[number],
    });

    const debouncedQuery = useDebounce(filters.query, 500);

    const navigate = useNavigate();

    const fetchBookings = async () => {
        setIsLoading(true);
        const bookings = await getBookings(date.startOf("day").toISOString());
        setBookings(bookings);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [date]);

    const filteredBookings = useMemo(() => {
        const filterFn = (b: Booking) => {
            if (!filters.key) return true;
            const regex = new RegExp(debouncedQuery, "ig");
            if (filters.key !== "vehicle") return b[filters.key]?.match(regex);
            return !filters.vehicle || b.vehicle.number === filters.vehicle?.number;
        };
        const Brahmapuram = bookings.Brahmapuram?.filter(filterFn);
        const Willington = bookings.Willington?.filter(filterFn);
        return { Willington, Brahmapuram };
    }, [filters.key, filters.vehicle, bookings, debouncedQuery]);

    const exportFile = () => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Sheet 1");
        const { Brahmapuram, Willington } = filteredBookings;

        ws.columns = [
            { header: "Booking ID", key: "booking_id", width: 30 },
            { header: "Name", key: "name", width: 30 },
            { header: "Vehicle number", key: "vehicle_number", width: 20 },
            { header: "Driver name", key: "driver_name", width: 30 },
        ];

        ws.mergeCells("A1:D1");
        ws.getCell("A1").value = `${date.format("DD/MM/YYYY")} Willington`;
        ws.getCell("A1").font = { bold: true };
        ws.getCell(`A1`).alignment = { horizontal: "center" };

        const headersRow1 = ws.addRow(["Booking ID", "Name", "Vehicle number", "Driver name"]);
        headersRow1.font = { bold: true };

        Willington.forEach(ele =>
            ws.addRow({
                ...ele,
                vehicle_number: ele.vehicle.number,
                driver_name: ele.vehicle.driver_name,
            }),
        );

        ws.addRow({});
        ws.addRow({});

        ws.mergeCells(`F1:I1`);
        ws.getCell(`F1`).value = `${date.format("DD/MM/YYYY")} Brahmapuram`;
        ws.getCell(`F1`).font = { bold: true };
        ws.getCell(`F1`).alignment = { horizontal: "center" };

        for (let i = "F".charCodeAt(0), j = 0; i < "J".charCodeAt(0); i++, j++) {
            const columnKey = String.fromCharCode(i);
            ws.getCell(`${columnKey}2`).value = ws.columns.map(c => c.header)[j] as string;
            ws.getCell(`${columnKey}2`).font = { bold: true };
            ws.getColumn(columnKey).width = ws.columns[j].width || 20;
        }

        Brahmapuram.forEach((ele, index) => {
            for (let i = "F".charCodeAt(0), j = 0; i < "J".charCodeAt(0); i++, j++) {
                const columnKey = String.fromCharCode(i);
                if (ws.columns[j].key === "vehicle_number") {
                    ws.getCell(`${columnKey}${index + 3}`).value = ele.vehicle.number;
                } else if (ws.columns[j].key === "driver_name") {
                    ws.getCell(`${columnKey}${index + 3}`).value = ele.vehicle.driver_name;
                } else {
                    ws.getCell(`${columnKey}${index + 3}`).value = ele[ws.columns[j].key || ""];
                }
            }
        });

        wb.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: "application/xlsx" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `data-${date.format("DD/MM/YYYY")}.xlsx`;
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    };

    const handleCloseModal = () => setDeletingBooking(null);

    const handleDeleteBooking = async () => {
        setIsDeleteLoading(true);
        deletingBooking && (await deleteBooking(deletingBooking?.booking_id));
        handleCloseModal();
        setIsDeleteLoading(false);
        fetchBookings();
    };

    const handleEditStatus = async (booking: Booking) => {
        await editStatus(booking.status === "Pending" ? "Completed" : "Pending", booking.booking_id);
        fetchBookings();
    };

    return (
        <div className="list_container">
            <Dialog open={!!deletingBooking} onClose={handleCloseModal}>
                <DialogTitle variant="h5" fontWeight={700}>
                    Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete the booking?</DialogContentText>
                    <DialogActions sx={{ justifyContent: "space-between", paddingBlock: "2rem 1rem", px: 0 }}>
                        <Button variant="contained" size="large" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={
                                isDeleteLoading ? (
                                    <CircularProgress size={20} sx={{ color: "white" }} />
                                ) : (
                                    <MdDelete />
                                )
                            }
                            size="large"
                            onClick={handleDeleteBooking}
                            disabled={isDeleteLoading}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <div className="list_header">
                <div className="list_date">
                    <DatePicker
                        sx={{ scale: "0.75", transformOrigin: "left top" }}
                        value={date}
                        onChange={date => setDate(date!)}
                        format="DD/MM/YYYY"
                    />
                </div>
                <div className="list_keys">
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Select</InputLabel>
                        <Select
                            size="small"
                            onChange={e =>
                                setFilters(ps => ({ ...ps, key: e.target.value as keyof Booking }))
                            }
                            value={filters.key}
                        >
                            {keys.map(k => (
                                <MenuItem value={k.value} key={k.value}>
                                    {k.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                {filters.key === "vehicle" && (
                    <div className="list_vehicles">
                        <Autocomplete
                            options={vehicles}
                            getOptionLabel={o => o.number}
                            renderInput={props => (
                                <TextField {...props} placeholder="Select vehicle number" />
                            )}
                            size="small"
                            value={filters.vehicle}
                            onChange={(e, v) => setFilters(ps => ({ ...ps, vehicle: v! }))}
                            disableClearable
                        />
                    </div>
                )}
                {filters.key !== "vehicle" && (
                    <TextField
                        placeholder="Search"
                        size="small"
                        value={filters.query}
                        onChange={e => setFilters(ps => ({ ...ps, query: e.target.value }))}
                    />
                )}
                <Button
                    startIcon={<IoMdAdd />}
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/create")}
                >
                    Add new booking
                </Button>
                <Button startIcon={<IoMdAdd />} variant="contained" size="large" onClick={exportFile}>
                    Export
                </Button>
            </div>
            {plants.map(p => (
                <div className="list_plant" key={p.label}>
                    <h2>{p.label}</h2>
                    <DataGrid
                        rows={filteredBookings[p.label]}
                        columns={columns(setDeletingBooking, handleEditStatus)}
                        disableRowSelectionOnClick
                        loading={isLoading}
                        sx={{
                            border: "none",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                            table: { padding: "3rem" },
                            "& .MuiDataGrid-cell": {
                                border: "none",
                                "&:focus": {
                                    outline: "none",
                                },
                            },
                        }}
                        autoPageSize
                        pagination
                    />
                </div>
            ))}
        </div>
    );
};

export default BookingList;
