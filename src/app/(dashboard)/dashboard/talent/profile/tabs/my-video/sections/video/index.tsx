"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Box, Grid, Typography, IconButton, Button, Snackbar, Alert, LinearProgress, Chip } from "@mui/material"
import { DeleteOutlineOutlined, VideoFile } from "@mui/icons-material"
import { getCurrentUser, updateUser } from "@/@core/services/user"
import { uploadFile, uploadFileWithFetch } from "@/@core/services/user"

interface VideoUploadSectionProps {
  userId?: number
  initialVideoUrl?: string
  maxSizeMB?: number
  maxDurationSeconds?: number
}

const VideoUploadSection: React.FC<VideoUploadSectionProps> = ({
  userId: propUserId,
  initialVideoUrl: propVideoUrl,
  maxSizeMB = 20,
  maxDurationSeconds = 300,
}) => {
  const [userId, setUserId] = useState<number | null>(propUserId || null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [tempVideoUrl, setTempVideoUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState(propVideoUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(!propUserId || !propVideoUrl)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (propUserId && propVideoUrl) return

      try {
        setIsLoading(true)
        const response = await getCurrentUser()
        if (response?.user) {
          setUserId(response.user.id)
          setVideoUrl(response.user.video_url || "")
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        setError("Failed to load video data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [propUserId, propVideoUrl])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const validateVideo = (file: File): Promise<{ isValid: boolean; duration?: number; error?: string }> => {
    return new Promise((resolve) => {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        resolve({
          isValid: false,
          error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${maxSizeMB}MB`,
        })
        return
      }

      const video = document.createElement("video")
      video.preload = "metadata"

      video.onloadedmetadata = () => {
        const duration = video.duration
        if (duration > maxDurationSeconds) {
          resolve({
            isValid: false,
            error: `Video duration (${formatDuration(duration)}) exceeds the maximum limit of ${formatDuration(maxDurationSeconds)}`,
          })
        } else {
          resolve({ isValid: true, duration })
        }
        URL.revokeObjectURL(video.src)
      }

      video.onerror = () => {
        resolve({
          isValid: false,
          error: "Invalid video file or unsupported format",
        })
        URL.revokeObjectURL(video.src)
      }

      video.src = URL.createObjectURL(file)
    })
  }

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVideoFile(file)
      setUploadProgress(0)
      setError(null)

      try {
        setIsValidating(true)

        const validation = await validateVideo(file)

        if (!validation.isValid) {
          setError(validation.error || "Invalid video file")
          setVideoFile(null)
          return
        }

        setVideoDuration(validation.duration || null)
        const previewUrl = URL.createObjectURL(file)
        setTempVideoUrl(previewUrl)

        setIsValidating(false)
        setIsUploading(true)

        const formData = new FormData()
        formData.append("file", file)

        // Try axios first, fallback to XMLHttpRequest if CORS issues persist
        let uploaded
        try {
          uploaded = await uploadFile(formData, setUploadProgress)
        } catch (corsError) {
          console.warn("Axios upload failed, trying XMLHttpRequest:", corsError)
          uploaded = await uploadFileWithFetch(formData, setUploadProgress)
        }

        if (uploaded?.url) {
          setVideoUrl(uploaded.url)
          setVideoFile(null)
          setTempVideoUrl(null)
          setSuccess("Video uploaded successfully!")

          if (userId) {
            await updateUser(userId, { video_url: uploaded.url })
          }
        } else {
          throw new Error("Invalid upload response")
        }
      } catch (err) {
        console.error("Video upload failed:", err)
        setError(err instanceof Error ? err.message : "Failed to upload video.")
        setVideoFile(null)
        setTempVideoUrl(null)
      } finally {
        setIsUploading(false)
        setIsValidating(false)
        setUploadProgress(0)
        if (tempVideoUrl) {
          URL.revokeObjectURL(tempVideoUrl)
        }
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeVideo = async () => {
    try {
      setVideoFile(null)
      setTempVideoUrl(null)
      setVideoUrl("")
      setVideoDuration(null)
      if (userId) {
        await updateUser(userId, { video_url: "" })
      }
      setSuccess("Video removed successfully!")
    } catch (error) {
      console.error("Failed to remove video:", error)
      setError("Failed to remove video.")
    }
  }

  const handleCloseError = () => {
    setError(null)
  }

  const handleCloseSuccess = () => {
    setSuccess(null)
  }

  return (
    <section>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#39353D", fontSize: "16px" }}>
              Upload Video of Yourself
            </Typography>
            <Typography sx={{ fontSize: "13px", mb: "10px" }}>
              Upload a video file (MP4, WebM, etc.). Max size: {maxSizeMB}MB, Max duration:{" "}
              {formatDuration(maxDurationSeconds)}
            </Typography>
          </Box>
          {!isLoading && (
            <IconButton onClick={removeVideo} disabled={isUploading || isValidating || !videoUrl}>
              <DeleteOutlineOutlined />
            </IconButton>
          )}
        </Box>

        <Grid container columnSpacing={4} rowSpacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                border: "1px dashed #D0D5DD",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              {(tempVideoUrl || videoUrl) && !isLoading ? (
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <video
                    src={tempVideoUrl || videoUrl}
                    controls
                    style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
                  />
                  {videoDuration && (
                    <Chip
                      icon={<VideoFile />}
                      label={`Duration: ${formatDuration(videoDuration)}`}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>
              ) : (
                <Typography sx={{ color: "#666", mb: "10px" }}>No video selected</Typography>
              )}

              {(isUploading || isValidating) && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="caption">{isValidating ? "Validating video..." : "Uploading..."}</Typography>
                    {isUploading && <Typography variant="caption">{Math.round(uploadProgress)}%</Typography>}
                  </Box>
                  <LinearProgress
                    variant={isValidating ? "indeterminate" : "determinate"}
                    value={uploadProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleVideoChange} />
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                  onClick={triggerFileInput}
                  disabled={isUploading || isLoading || isValidating}
                >
                  {isValidating
                    ? "Validating..."
                    : isUploading
                      ? `Uploading... ${Math.round(uploadProgress)}%`
                      : "Upload Video"}
                </Button>
              </Box>

              {videoFile && !isUploading && !isValidating && (
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ display: "block" }}>
                    Selected: {videoFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "#666" }}>
                    Size: {formatFileSize(videoFile.size)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default VideoUploadSection
