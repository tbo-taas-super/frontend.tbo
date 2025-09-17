"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/@core/services/user"
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Link,
  Chip,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Stack,
  Skeleton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import {
  Email,
  Phone,
  Description,
  VideoLibrary,
  Work,
  Photo,
  Link as LinkIcon,
  Visibility,
  Download,
  Close,
  Person,
  Badge,
  School,
  Business,
} from "@mui/icons-material"
import { parseCloudinaryUrl, getPdfViewerUrl, canPreviewFile } from "@/@core/utils/cloudinary-helpers"

interface FileData {
  url: string
  name: string
  type: string
}

interface EducationEntry {
  degree: string
  institution: string
  year: string
}

const AllProfile = () => {
  const [userData, setUserData] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<{ url: string; name: string; type: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await getCurrentUser()
        if (response?.user) {
          // Parse education if it's a string
          const user = {
            ...response.user,
            education: response.user.education ? JSON.parse(response.user.education) : [],
          }
          setUserData(user)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUserData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handlePreview = (url: string, name: string, type: string) => {
    setPreviewData({ url, name, type })
    setPreviewOpen(true)
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderPreviewContent = () => {
    if (!previewData) return null

    if (previewData.type.startsWith("image/")) {
      return (
        <img
          src={previewData.url || "/placeholder.svg"}
          alt={previewData.name}
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
        />
      )
    } else if (previewData.type === "application/pdf") {
      const pdfViewerUrl = getPdfViewerUrl(previewData.url)
      return (
        <iframe src={pdfViewerUrl} width="100%" height="600px" style={{ border: "none" }} title={previewData.name} />
      )
    } else if (previewData.url.includes("video") || previewData.type.startsWith("video/")) {
      return (
        <video
          src={previewData.url}
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
          }}
        />
      )
    }

    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preview not available
        </Typography>
        <Button variant="contained" onClick={() => window.open(previewData.url, "_blank")}>
          Open in New Tab
        </Button>
      </Box>
    )
  }

  const FilePreviewCard = ({
    title,
    url,
    icon,
    fileName,
    fileType = "application/pdf",
  }: {
    title: string
    url: string
    icon: React.ReactNode
    fileName?: string
    fileType?: string
  }) => {
    const urlInfo = parseCloudinaryUrl(url)
    const displayName = fileName || url.split("/").pop() || title

    return (
      <Card sx={{ height: "100%", transition: "all 0.2s", "&:hover": { boxShadow: 4 } }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {icon}
            <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>

          {fileType.startsWith("image/") && (
            <Box
              sx={{
                width: "100%",
                height: "120px",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
                cursor: "pointer",
                border: "1px solid #e0e0e0",
              }}
              onClick={() => handlePreview(url, displayName, fileType)}
            >
              <img
                src={url || "/placeholder.svg"}
                alt={displayName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=120&width=200&text=Image"
                }}
              />
            </Box>
          )}

          <Typography variant="caption" sx={{ display: "block", mb: 1, color: "text.secondary" }}>
            {displayName.length > 30 ? `${displayName.substring(0, 30)}...` : displayName}
          </Typography>

          <Stack direction="row" spacing={1}>
            {canPreviewFile(fileType, url) && (
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={() => handlePreview(url, displayName, fileType)}
                sx={{ textTransform: "none" }}
              >
                Preview
              </Button>
            )}
            <Button
              size="small"
              startIcon={<Download />}
              onClick={() => handleDownload(url, displayName)}
              sx={{ textTransform: "none" }}
            >
              Download
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Skeleton variant="circular" width={120} height={120} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="error">
          Failed to load user data
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, background: "linear-gradient(135deg,rgb(234, 102, 102) 0%,rgb(134, 1, 1) 100%)", color: "white" }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={userData.profile_image}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {userData.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<Badge />}
                label={userData.account_type}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              {userData.designation && (
                <Chip
                  icon={<Work />}
                  label={userData.designation}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Email fontSize="small" />
                <Typography variant="body2">{userData.email}</Typography>
              </Box>
              {userData.phone_number && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{userData.phone_number}</Typography>
                </Box>
              )}
              {userData.current_company && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Business fontSize="small" />
                  <Typography variant="body2">{userData.current_company}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Professional Summary Section */}
      {userData.professional_summary && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
            Professional Summary
          </Typography>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {userData.professional_summary}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}

      {/* Skills Section */}
      {userData.skills && userData.skills.length > 0 && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
            Skills
          </Typography>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {userData.skills.map((skill: string, index: number) => (
                  <Chip key={index} label={skill} sx={{ fontSize: "14px" }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Education Section */}
      {userData.education && userData.education.length > 0 && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
            Education
          </Typography>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <List>
                {userData.education.map((edu: EducationEntry, index: number) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${edu.degree}, ${edu.institution}`}
                      secondary={`Year: ${edu.year}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}

      {/* Documents Section */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
        Documents & Files
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {userData.cv_upload && (
          <Grid item xs={12} sm={6} md={4}>
            <FilePreviewCard
              title="CV/Resume"
              url={userData.cv_upload}
              icon={<Description color="primary" />}
              fileName="CV-Resume.pdf"
              fileType="application/pdf"
            />
          </Grid>
        )}
        {userData.cover_letter_upload && (
          <Grid item xs={12} sm={6} md={4}>
            <FilePreviewCard
              title="Cover Letter"
              url={userData.cover_letter_upload}
              icon={<Description color="secondary" />}
              fileName="Cover-Letter.pdf"
              fileType="application/pdf"
            />
          </Grid>
        )}
        {userData.id_upload && (
          <Grid item xs={12} sm={6} md={4}>
            <FilePreviewCard
              title="ID Document"
              url={userData.id_upload}
              icon={<Person color="info" />}
              fileName="ID-Document.jpg"
              fileType="image/jpeg"
            />
          </Grid>
        )}
        {userData.work_sample_upload && (
          <Grid item xs={12} sm={6} md={4}>
            <FilePreviewCard
              title="Work Sample"
              url={userData.work_sample_upload}
              icon={<Work color="success" />}
              fileName="Work-Sample.pdf"
              fileType="application/pdf"
            />
          </Grid>
        )}
      </Grid>

      {/* Media Section */}
      {(userData.video_url || (userData.project_screenshots && userData.project_screenshots.length > 0)) && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
            Media & Portfolio
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {userData.video_url && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%", transition: "all 0.2s", "&:hover": { boxShadow: 4 } }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <VideoLibrary color="error" />
                      <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
                        Introduction Video
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: "120px",
                        borderRadius: 1,
                        overflow: "hidden",
                        mb: 2,
                        cursor: "pointer",
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                      }}
                      onClick={() => handlePreview(userData.video_url, "Introduction Video", "video/mp4")}
                    >
                      <VideoLibrary sx={{ fontSize: 48, color: "#666" }} />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handlePreview(userData.video_url, "Introduction Video", "video/mp4")}
                        sx={{ textTransform: "none" }}
                      >
                        Watch
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleDownload(userData.video_url, "introduction-video.mp4")}
                        sx={{ textTransform: "none" }}
                      >
                        Download
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {userData.project_screenshots &&
              userData.project_screenshots.map((screenshot: string, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FilePreviewCard
                    title={`Project Screenshot ${index + 1}`}
                    url={screenshot}
                    icon={<Photo color="warning" />}
                    fileName={`screenshot-${index + 1}.jpg`}
                    fileType="image/jpeg"
                  />
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {/* Links Section */}
      {userData.portfolio_link && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#39353D" }}>
            External Links
          </Typography>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LinkIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Portfolio Link
                    </Typography>
                    <Link
                      href={userData.portfolio_link}
                      target="_blank"
                      sx={{ fontSize: "14px", wordBreak: "break-all" }}
                    >
                      {userData.portfolio_link}
                    </Link>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(userData.portfolio_link, "_blank")}
                  sx={{ textTransform: "none" }}
                >
                  Visit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: "500px" },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">{previewData?.name}</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>{renderPreviewContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {previewData && (
            <>
              <Button
                onClick={() => handleDownload(previewData.url, previewData.name)}
                variant="outlined"
                startIcon={<Download />}
              >
                Download
              </Button>
              <Button
                onClick={() => window.open(previewData.url, "_blank")}
                variant="outlined"
                startIcon={<LinkIcon />}
              >
                Open in New Tab
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AllProfile