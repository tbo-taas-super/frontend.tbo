"use client"

import type React from "react"
import { Box, Grid, TextField, Typography, Button } from "@mui/material"
import DocumentUpload from "./components/document-upload"
import { useEffect, useState } from "react"
import { getCurrentUser, updateUser, uploadFile } from "@/@core/services/user"

interface FileData {
  url: string
  name: string
  type: string
}

const PortfolioTab = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [projectScreenshots, setProjectScreenshots] = useState<FileData[]>([])
  const [workSample, setWorkSample] = useState<FileData | null>(null)
  const [portfolioLink, setPortfolioLink] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Utility to extract file info from URL (similar to OtherInformationTab)
  const extractFileInfo = (url: string, defaultName: string, defaultType: string): FileData | null => {
    if (!url) return null

    const urlParts = url.split("/")
    const lastPart = urlParts[urlParts.length - 1]
    let fileName = lastPart || defaultName
    let fileType = defaultType

    if (fileName.includes(".")) {
      const extension = fileName.split(".").pop()?.toLowerCase()
      if (extension === "pdf") {
        fileType = "application/pdf"
      } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
        fileType = `image/${extension === "jpg" ? "jpeg" : extension}`
      }
    } else {
      fileName = defaultName
    }

    return { url, name: fileName, type: fileType }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const res = await getCurrentUser()
        const user = res.user
        if (user?.id) {
          setUserId(user.id)
          // Convert URLs to FileData objects
          setProjectScreenshots(
            (user.project_screenshots || []).map((url: string, i: number) =>
              extractFileInfo(url, `Screenshot-${i + 1}.png`, "image/png")
            ).filter((item: FileData | null): item is FileData => item !== null)
          )
          setWorkSample(
            user.work_sample_upload
              ? extractFileInfo(user.work_sample_upload, "Work-Sample.pdf", "application/pdf")
              : null
          )
          setPortfolioLink(user.portfolio_link || "")
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleAddProjectScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || userId === null) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadFile(formData)
      const fileData: FileData = {
        url: result.url,
        name: file.name,
        type: file.type,
      }
      const newScreenshots = [...projectScreenshots, fileData]
      setProjectScreenshots(newScreenshots)
      // Store only URLs in backend
      await updateUser(userId, { project_screenshots: newScreenshots.map((item) => item.url) })
    } catch (error) {
      console.error("Upload or update failed:", error)
    }
  }

  const handleRemoveProjectScreenshot = async (index: number) => {
    if (userId === null) return
    const newScreenshots = projectScreenshots.filter((_, i) => i !== index)
    setProjectScreenshots(newScreenshots)
    try {
      await updateUser(userId, { project_screenshots: newScreenshots.map((item) => item.url) })
    } catch (error) {
      console.error("Failed to update screenshots:", error)
    }
  }

  const handleWorkSampleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || userId === null) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadFile(formData)
      const fileData: FileData = {
        url: result.url,
        name: file.name,
        type: file.type,
      }
      setWorkSample(fileData)
      await updateUser(userId, { work_sample_upload: result.url })
    } catch (error) {
      console.error("Upload or update failed:", error)
    }
  }

  const handleRemoveWorkSample = async () => {
    if (userId === null) return
    setWorkSample(null)
    try {
      await updateUser(userId, { work_sample_upload: "" })
    } catch (error) {
      console.error("Failed to remove work sample:", error)
    }
  }

  const handleSavePortfolioLink = async () => {
    if (userId === null) return
    setIsSaving(true)
    try {
      await updateUser(userId, { portfolio_link: portfolioLink })
    } catch (error) {
      console.error("Failed to update portfolio link:", error)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <section>
        <Box sx={{ mt: "30px" }}>
          <Typography>Loading...</Typography>
        </Box>
      </section>
    )
  }

  return (
    <section>
      <Box sx={{ mt: "30px" }}>
        <Typography sx={{ fontWeight: 600, color: "#39353D", fontSize: "16px" }}>
          Portfolio / Work Done
        </Typography>
        <Typography sx={{ fontSize: "13px", mb: "20px" }}>
          Showcase your past work or projects
        </Typography>

        <Grid container columnSpacing={4} rowSpacing={4}>
          {/* Project Screenshots */}
          <Grid item xs={12} lg={4}>
            <Typography sx={{ mb: 1, fontWeight: 600 }}>Upload Project Screenshot(s)</Typography>
            {projectScreenshots.map((fileData, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <DocumentUpload
                  label={`Screenshot ${i + 1}`}
                  accept="image/*"
                  fileData={fileData}
                  onChange={() => {}} // No onChange for existing screenshots
                  onRemove={() => handleRemoveProjectScreenshot(i)}
                  description={`Project Screenshot ${i + 1}`}
                />
              </Box>
            ))}
            {/* Add new screenshot */}
            <DocumentUpload
              label="Add Screenshot"
              accept="image/*"
              fileData={null}
              onChange={handleAddProjectScreenshot}
              onRemove={() => {}}
              description="Upload a project screenshot (Image)"
            />
          </Grid>

          {/* Work Sample Document */}
          <Grid item xs={12} lg={4}>
            <Typography sx={{ mb: 1, fontWeight: 600 }}>Upload Work Sample Document</Typography>
            <DocumentUpload
              label="Work Sample"
              accept="application/pdf"
              fileData={workSample}
              onChange={handleWorkSampleUpload}
              onRemove={handleRemoveWorkSample}
              description="Upload your work sample (PDF)"
            />
          </Grid>

          {/* Portfolio Link */}
          <Grid item xs={12} lg={4}>
            <Box>
              <Typography
                sx={{ color: "#101928", fontSize: "12px", fontWeight: 500, marginBottom: "5px" }}
              >
                Portfolio Link
              </Typography>
              <TextField
                placeholder="Enter your portfolio link (e.g., GitHub, Behance, Dribbble)"
                sx={{ width: "100%" }}
                inputProps={{ style: { fontSize: "12px" } }}
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
              />
              <Button sx={{ mt: 1 }} variant="contained" disabled={isSaving} onClick={handleSavePortfolioLink}>
                Save Link
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </section>
  )
}

export default PortfolioTab