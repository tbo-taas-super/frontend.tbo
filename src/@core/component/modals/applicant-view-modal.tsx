"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Link,
} from "@mui/material"
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Link as LinkIcon,
  VideoCameraBack as VideoIcon,
} from "@mui/icons-material"
import { InterestReceivedModal } from "./interest-received-modal"
import DocumentUpload from "./document-upload"

interface ApplicantData {
  id: number
  name: string
  email: string
  jobTitle: string
  applicationDate: string
  type: string
  status: string
  account_type?: string
  company_logo?: string | null
  company_name?: string | null
  company_email_address?: string | null
  industry?: string | null
  number_of_employees?: string | null
  type_of_employer?: string | null
  company_address?: string | null
  company_phone_number?: string | null
  country?: string | null
  company_website?: string | null
  contact_person?: string | null
  work_email?: string | null
  position_in_company?: string | null
  phone_number?: string | null
  cv_upload?: string | null
  cover_letter_upload?: string | null
  id_upload?: string | null
  video_url?: string | null
  project_screenshots?: string[] | null
  work_sample_upload?: string | null
  portfolio_link?: string | null
  profile_image?: string | null
  designation?: string | null
  email_verified_at?: string | null
  otp?: string | null
  otp_expires_at?: string | null
  is_verified?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  status_user?: string
  reset_token?: string | null
}

interface ApplicantViewModalProps {
  applicant: ApplicantData
  open: boolean
  onClose: () => void
}

export function ApplicantViewModal({ applicant, open, onClose }: ApplicantViewModalProps) {
  const [interestModalOpen, setInterestModalOpen] = useState(false)

  const handleActionClick = () => {
    if (applicant.type === "Recommended") {
      setInterestModalOpen(true)
      setTimeout(() => {
        setInterestModalOpen(false)
        onClose()
      }, 3000)
    } else {
      console.log("Shortlisted:", applicant.name)
      onClose()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hired":
        return { bgcolor: "#ECFDF5", color: "#065F46" }
      case "Interviewed":
        return { bgcolor: "#F0F9FF", color: "#0C4A6E" }
      case "Shortlisted":
        return { bgcolor: "#FFFBEB", color: "#92400E" }
      case "Rejected":
        return { bgcolor: "#FEF2F2", color: "#991B1B" }
      case "Submitted":
        return { bgcolor: "#F3F4F6", color: "#374151" }
      case "SCHEDULED":
        return { bgcolor: "#F0F9FF", color: "#0C4A6E" }
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Applied":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" }
      case "Interested":
        return { bgcolor: "#ECFDF5", color: "#065F46" }
      case "Recommended":
        return { bgcolor: "#FEF3C7", color: "#92400E" }
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" }
    }
  }

  const getAccountTypeColor = (accountType: string | undefined) => {
    switch (accountType) {
      case "TALENT":
        return { bgcolor: "#E0F2FE", color: "#075985" }
      case "EMPLOYER":
        return { bgcolor: "#FEF3C7", color: "#92400E" }
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" }
    }
  }

  // Mock file change and remove handlers (since we're only displaying, not uploading)
  const handleFileChange = () => {
    // No-op for display-only
  }

  const handleFileRemove = () => {
    // No-op for display-only
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Applicant Profile</span>
            <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
              {applicant.profile_image ? (
                <Avatar src={applicant.profile_image} sx={{ width: 64, height: 64 }} />
              ) : (
                <Avatar sx={{ width: 64, height: 64 }}>
                  {applicant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {applicant.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Applied for {applicant.jobTitle}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {applicant.country || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {applicant.designation || "N/A"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <Chip label={applicant.type} size="small" sx={getTypeColor(applicant.type)} />
                  <Chip label={applicant.status} size="small" sx={getStatusColor(applicant.status)} />
                  <Chip
                    label={applicant.account_type || "Unknown"}
                    size="small"
                    sx={getAccountTypeColor(applicant.account_type)}
                  />
                  <Chip
                    label={applicant.is_verified ? "Verified" : "Not Verified"}
                    size="small"
                    icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: applicant.is_verified ? "#ECFDF5" : "#FEF2F2", color: applicant.is_verified ? "#065F46" : "#991B1B" }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Contact Information */}
            <Card sx={{ bgcolor: "#F9FAFB", mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: "text.primary" }} />
                    <Typography variant="body2">{applicant.email}</Typography>
                  </Box>
                  {applicant.work_email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: "text.primary" }} />
                      <Typography variant="body2">{applicant.work_email} (Work)</Typography>
                    </Box>
                  )}
                  {applicant.phone_number && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: "text.primary" }} />
                      <Typography variant="body2">{applicant.phone_number}</Typography>
                    </Box>
                  )}
                  {applicant.contact_person && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">Contact Person: {applicant.contact_person}</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Company Information (if applicable) */}
            {(applicant.company_name ||
              applicant.company_email_address ||
              applicant.industry ||
              applicant.number_of_employees ||
              applicant.type_of_employer ||
              applicant.company_address ||
              applicant.company_phone_number ||
              applicant.company_website) && (
              <Card sx={{ bgcolor: "#F9FAFB", mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Company Information
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {applicant.company_name && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BusinessIcon sx={{ fontSize: 16, color: "text.primary" }} />
                        <Typography variant="body2">{applicant.company_name}</Typography>
                      </Box>
                    )}
                    {applicant.company_email_address && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: "text.primary" }} />
                        <Typography variant="body2">{applicant.company_email_address}</Typography>
                      </Box>
                    )}
                    {applicant.company_phone_number && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "text.primary" }} />
                        <Typography variant="body2">{applicant.company_phone_number}</Typography>
                      </Box>
                    )}
                    {applicant.industry && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Industry: {applicant.industry}</Typography>
                      </Box>
                    )}
                    {applicant.number_of_employees && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Employees: {applicant.number_of_employees}</Typography>
                      </Box>
                    )}
                    {applicant.type_of_employer && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Employer Type: {applicant.type_of_employer}</Typography>
                      </Box>
                    )}
                    {applicant.company_address && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: "text.primary" }} />
                        <Typography variant="body2">{applicant.company_address}</Typography>
                      </Box>
                    )}
                    {applicant.company_website && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinkIcon sx={{ fontSize: 16, color: "text.primary" }} />
                        <Link href={applicant.company_website} target="_blank" rel="noopener noreferrer">
                          {applicant.company_website}
                        </Link>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Application Details */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Application Date
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {applicant.applicationDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Job Title
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {applicant.jobTitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {applicant.created_at && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Profile Created
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(applicant.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {applicant.updated_at && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Profile Updated
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(applicant.updated_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Documents Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Documents
                </Typography>
                <Grid container spacing={2}>
                  {applicant.profile_image && (
                    <Grid item xs={12} md={6}>
                      <DocumentUpload
                        label="Profile Image"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        fileData={{
                          url: applicant.profile_image,
                          name: `Profile_${applicant.name}.png`,
                          type: "image/png",
                        }}
                      />
                    </Grid>
                  )}
                  {applicant.cv_upload && (
                    <Grid item xs={12} md={6}>
                      <DocumentUpload
                        label="CV/Resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        fileData={{
                          url: applicant.cv_upload,
                          name: `CV_${applicant.name}.pdf`,
                          type: "application/pdf",
                        }}
                      />
                    </Grid>
                  )}
                  {applicant.cover_letter_upload && (
                    <Grid item xs={12} md={6}>
                      <DocumentUpload
                        label="Cover Letter"
                        accept=".pdf"
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        fileData={{
                          url: applicant.cover_letter_upload,
                          name: `CoverLetter_${applicant.name}.pdf`,
                          type: "application/pdf",
                        }}
                      />
                    </Grid>
                  )}
                  {applicant.id_upload && (
                    <Grid item xs={12} md={6}>
                      <DocumentUpload
                        label="ID Document"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        fileData={{
                          url: applicant.id_upload,
                          name: `ID_${applicant.name}`,
                          type: applicant.id_upload.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
                        }}
                      />
                    </Grid>
                  )}
                  {applicant.work_sample_upload && (
                    <Grid item xs={12} md={6}>
                      <DocumentUpload
                        label="Work Sample"
                        accept=".pdf"
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        fileData={{
                          url: applicant.work_sample_upload,
                          name: `WorkSample_${applicant.name}.pdf`,
                          type: "application/pdf",
                        }}
                      />
                    </Grid>
                  )}
                  {applicant.video_url && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Video
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <VideoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Link href={applicant.video_url} target="_blank" rel="noopener noreferrer">
                              View Video
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {applicant.portfolio_link && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Portfolio Link
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Link href={applicant.portfolio_link} target="_blank" rel="noopener noreferrer">
                              {applicant.portfolio_link}
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {applicant.project_screenshots && applicant.project_screenshots.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Project Screenshots
                      </Typography>
                      <Grid container spacing={2}>
                        {applicant.project_screenshots.map((screenshot, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <DocumentUpload
                              label={`Screenshot ${index + 1}`}
                              accept=".jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              onRemove={handleFileRemove}
                              fileData={{
                                url: screenshot,
                                name: `Screenshot_${index + 1}_${applicant.name}.jpg`,
                                type: "image/jpeg",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                  {!applicant.profile_image &&
                    !applicant.cv_upload &&
                    !applicant.cover_letter_upload &&
                    !applicant.id_upload &&
                    !applicant.work_sample_upload &&
                    !applicant.video_url &&
                    !applicant.portfolio_link &&
                    (!applicant.project_screenshots || applicant.project_screenshots.length === 0) && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No documents available
                        </Typography>
                      </Grid>
                    )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          {/* <Button variant="contained" onClick={handleActionClick}>
            {applicant.type === "Recommended" ? "I am interested" : "Shortlist"}
          </Button> */}
        </DialogActions>
      </Dialog>

      <InterestReceivedModal open={interestModalOpen} applicantName={applicant.name} />
    </>
  )
}
