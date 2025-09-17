"use client"

import { Dialog, DialogContent, Box, Typography, Alert } from "@mui/material"
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material"

interface InterestReceivedModalProps {
  open: boolean
  applicantName: string
}

export function InterestReceivedModal({ open, applicantName }: InterestReceivedModalProps) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Interest Received!
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your interest has been received and our team will contact you shortly
          </Alert>
          <Typography variant="body2" color="text.secondary">
            We'll be in touch soon regarding {applicantName} for this position.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
