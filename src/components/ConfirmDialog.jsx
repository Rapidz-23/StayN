import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

// Used for delete, cancel and reject confirmations. `children` can hold extra fields (e.g. a reason box).
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", danger = false, onConfirm, onClose, children, confirmDisabled = false }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: "12px" } } }}>
      <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        {message && <DialogContentText>{message}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} sx={{ borderColor: "var(--border)" }}>Cancel</Button>
        <Button variant="contained" color={danger ? "error" : "primary"} disabled={confirmDisabled} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
