
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Chip,
  Link,
  Pagination,
} from "@mui/material"
import { Close as CloseIcon, ThumbUp as ThumbUpIcon } from "@mui/icons-material"

interface ApplicantData {
  id: number
  name: string
  email: string
  jobTitle: string
  applicationDate: string
  type: string
  status: string
  phone?: string
  location?: string
  resume?: string
  profile_image?: string | null
  designation?: string | null
  years_experience?: number | null
  skills?: string[]
}

interface RecommendationsModalProps {
  open: boolean
  onClose: () => void
  recommendedApplicants: ApplicantData[]
  jobTitle: string
}

export function RecommendationsModal({ open, onClose, recommendedApplicants, jobTitle }: RecommendationsModalProps) {
  const [interestedApplicants, setInterestedApplicants] = useState<Set<number>>(new Set())
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [lastInterestedName, setLastInterestedName] = useState("")
  const [page, setPage] = useState(1)
  const itemsPerPage = 6 // Default: Show 6 candidates per page. Adjust this number to change the default.

  const handleInterested = (applicant: ApplicantData) => {
    setInterestedApplicants((prev) => new Set(prev).add(applicant.id))
    setLastInterestedName(applicant.name.split(" ")[0])
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginatedApplicants = recommendedApplicants.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6">AI Recommendations</Typography>
          <Typography variant="body2" color="text.secondary">
            {recommendedApplicants.length} candidates recommended for {jobTitle}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {showSuccessMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccessMessage(false)}>
            Your interest in {lastInterestedName} has been received! TBO team will contact you shortly.
          </Alert>
        )}

        <Grid container spacing={2}>
          {paginatedApplicants.map((applicant) => {
            const isInterested = interestedApplicants.has(applicant.id)

            return (
              <Grid item xs={12} sm={6} md={4} key={applicant.id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ textAlign: "center", mb: 1 }}>
                      <Avatar
                        src={applicant.profile_image || undefined}
                        sx={{
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 1,
                          bgcolor: "primary.main",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {!applicant.profile_image && getInitials(applicant.name)}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                        {applicant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {applicant.designation || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {applicant.years_experience ? `${applicant.years_experience} yrs exp` : "N/A"} • {applicant.location || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5, fontSize: "0.9rem" }}>
                        Key Skills
                      </Typography>
                      {applicant.skills && applicant.skills.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {applicant.skills.slice(0, 3).map((skill, index) => (
                            <Chip key={index} label={skill} size="small" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                          No skills listed
                        </Typography>
                      )}
                    </Box>

                    {applicant.resume && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.8rem" }}>
                        <Link href={applicant.resume} target="_blank" rel="noopener">
                          View Resume
                        </Link>
                      </Typography>
                    )}

                  
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {recommendedApplicants.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(recommendedApplicants.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {recommendedApplicants.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No recommendations available for this position yet.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
