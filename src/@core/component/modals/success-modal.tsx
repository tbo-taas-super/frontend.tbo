import { Dialog, DialogContent, Box, Typography, Alert } from "@mui/material"
import { Favorite as FavoriteIcon } from "@mui/icons-material"

interface SuccessModalProps {
  open: boolean
  talentName: string
}

export function SuccessModal({ open, talentName }: SuccessModalProps) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <FavoriteIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Request Received!
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your request is received and our admin will contact you shortly
          </Alert>
          <Typography variant="body2" color="text.secondary">
            We'll be in touch soon regarding {talentName} for the selected position.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
