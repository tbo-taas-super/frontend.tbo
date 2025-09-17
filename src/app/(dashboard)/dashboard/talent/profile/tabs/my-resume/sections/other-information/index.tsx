"use client"

import type React from "react"
import { Box, Grid, Typography } from "@mui/material"
import DocumentUpload from "./components/document-upload"
import { useEffect, useState } from "react"
import { getCurrentUser, updateUser, uploadFile } from "@/@core/services/user"

interface FileData {
  url: string
  name: string
  type: string
}


interface FilePreviews {
  cv_upload: FileData | null
  cover_letter_upload: FileData | null
  id_upload: FileData | null
}

const OtherInformationTab = () => {
  const [filePreviews, setFilePreviews] = useState<FilePreviews>({
    cv_upload: null,
    cover_letter_upload: null,
    id_upload: null,
  })
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const res = await getCurrentUser()
        const user = res.user

        if (user?.id) {
          setUserId(user.id)

          // Extract filename from Cloudinary URL or use default names
          const extractFileInfo = (url: string, defaultName: string, defaultType: string): FileData | null => {
            if (!url) return null

            // Try to extract filename from Cloudinary URL
            const urlParts = url.split("/")
            const lastPart = urlParts[urlParts.length - 1]

            // For Cloudinary URLs, the filename might not have extension
            let fileName = lastPart || defaultName
            let fileType = defaultType

            // If the URL contains the original filename, try to extract it
            if (fileName.includes(".")) {
              const extension = fileName.split(".").pop()?.toLowerCase()
              if (extension === "pdf") {
                fileType = "application/pdf"
              } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
                fileType = `image/${extension === "jpg" ? "jpeg" : extension}`
              }
            } else {
              // For Cloudinary URLs without extension, assume based on context
              fileName = defaultName
            }

            return { url, name: fileName, type: fileType }
          }

          setFilePreviews({
            cv_upload: extractFileInfo(user.cv_upload || "", "CV-Resume.pdf", "application/pdf"),
            cover_letter_upload: extractFileInfo(user.cover_letter_upload || "", "Cover-Letter.pdf", "application/pdf"),
            id_upload: extractFileInfo(user.id_upload || "", "ID-Card.pdf", "application/pdf"),
          })
        } else {
          console.error("User ID is missing from the response:", res)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleRemoveFile = async (field: keyof FilePreviews) => {
    if (userId === null) return

    try {
      setFilePreviews((prev) => ({ ...prev, [field]: null }))
      await updateUser(userId, { [field]: "" })
    } catch (error) {
      console.error("Failed to remove file:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: keyof FilePreviews) => {
    const file = event.target.files?.[0]
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

      setFilePreviews((prev) => ({ ...prev, [field]: fileData }))
      await updateUser(userId, { [field]: result.url })
    } catch (error) {
      console.error("Upload or update failed:", error)
    }
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
        <Typography sx={{ fontWeight: 600, color: "#39353D", fontSize: "16px" }}>Other Information</Typography>
        <Typography sx={{ fontSize: "13px", mb: "20px" }}>Details about yourself</Typography>
        <Grid container columnSpacing={4} rowSpacing={4}>
          <Grid item xs={12} lg={4}>
            <DocumentUpload
              label="CV/Resume Upload"
              accept="application/pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, "cv_upload")}
              fileData={filePreviews.cv_upload}
              onRemove={() => handleRemoveFile("cv_upload")}
              description="Upload your CV or Resume (PDF, DOC, DOCX)"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DocumentUpload
              label="Cover Letter Upload"
              accept="application/pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, "cover_letter_upload")}
              fileData={filePreviews.cover_letter_upload}
              onRemove={() => handleRemoveFile("cover_letter_upload")}
              description="Upload your Cover Letter (PDF, DOC, DOCX)"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DocumentUpload
              label="ID Card Upload"
              accept="application/pdf,image/*"
              onChange={(e) => handleFileUpload(e, "id_upload")}
              fileData={filePreviews.id_upload}
              onRemove={() => handleRemoveFile("id_upload")}
              description="Upload your ID Card (PDF or Image)"
            />
          </Grid>
        </Grid>
      </Box>
    </section>
  )
}

export default OtherInformationTab
