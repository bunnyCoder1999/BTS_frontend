import { GridColDef } from "@mui/x-data-grid";
import { Booking } from "./types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { useState } from "react";
import dayjs from "dayjs";

const Actions = ({ value, onAddComment, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState(value.row.comment?.text || "");
    return (
        <div className="list_table_action">
            <Dialog open={open} fullWidth maxWidth="xs" onClose={() => setOpen(false)}>
                <DialogTitle variant="h5" fontWeight={700}>
                    Add Comments
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Comment</DialogContentText>
                    <TextField
                        autoComplete="off"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Enter Comment"
                        fullWidth
                        margin="dense"
                        type="password"
                        multiline
                        rows={10}
                    />
                    {value.row?.comment?.commented_on && (
                        <div className="last_updated_on">Last updated on {dayjs(value.row?.comment?.commented_on).format("DD/MM/YY HH:mm A")}</div>
                    )}
                    <DialogActions sx={{ paddingBlock: "2rem 1rem", px: 0 }}>
                        <Button
                            variant="contained"
                            color="info"
                            size="large"
                            onClick={async () => {
                                await onAddComment(value.row, comment);
                                setOpen(false);
                            }}
                            disabled={!comment}
                        >
                            Add Comment
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <IconButton onClick={() => onDelete(value.row)}>
                <MdDelete fill="red" />
            </IconButton>
            <IconButton onClick={() => setOpen(true)}>
                <BiSolidCommentDetail fill="white" />
            </IconButton>
        </div>
    );
};

export const columns: (
    onDelete: (b: Booking) => void,
    onEdit: (b: Booking) => void,
    onAddComment: (b: Booking, c: string) => void,
    isStatusChanging: boolean,
) => GridColDef<Booking>[] = (onDelete, onEdit, onAddComment, isStatusChanging) => [
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
                        disabled={isStatusChanging}
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
        width: 120,
        renderCell: value => <Actions onAddComment={onAddComment} value={value} onDelete={onDelete} />,
    },
];
