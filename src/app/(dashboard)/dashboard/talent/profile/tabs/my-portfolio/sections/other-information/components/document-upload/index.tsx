"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material"
import {
  CloudUpload,
  Delete,
  Visibility,
  PictureAsPdf,
  Description,
  Image as ImageIcon,
  Download,
  OpenInNew,
} from "@mui/icons-material"
import {
  getCloudinaryThumbnail,
  parseCloudinaryUrl,
  getPdfViewerUrl,
  canPreviewFile,
} from "@/@core/utils/cloudinary-helpers"

interface FileData {
  url: string
  name: string
  type: string
}

interface DocumentUploadProps {
  label: string
  accept: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileData: FileData | null
  onRemove: () => void
  description?: string
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  accept,
  onChange,
  fileData,
  onRemove,
  description,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon />
    } else if (type === "application/pdf") {
      return <PictureAsPdf />
    } else {
      return <Description />
    }
  }

  const formatFileName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name
    const extension = name.split(".").pop()
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."))
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 4)
    return `${truncated}...${extension}`
  }

  const handlePreview = () => {
    if (!fileData) return

    setPreviewError(null)
    setPreviewLoading(true)
    setPreviewOpen(true)

    setTimeout(() => {
      setPreviewLoading(false)
    }, 500)
  }

  const handleDownload = () => {
    if (!fileData) return

    const link = document.createElement("a")
    link.href = fileData.url
    link.download = fileData.name
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    if (!fileData) return
    window.open(fileData.url, "_blank", "noopener,noreferrer")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress (replace with actual upload logic)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onChange(event) // Call the original onChange handler after "upload" completes
        }
      }, 200)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      setUploadProgress(0)
      setIsUploading(false)
    }
  }, [])

  const renderThumbnail = () => {
    if (!fileData) return null

    const urlInfo = parseCloudinaryUrl(fileData.url)

    if (fileData.type.startsWith("image/")) {
      let thumbnailUrl = fileData.url

      if (urlInfo.isCloudinary) {
        thumbnailUrl = getCloudinaryThumbnail(fileData.url, fileData.type)
      }

      return (
        <Box
          sx={{
            width: "100%",
            height: "120px",
            borderRadius: "8px",
            overflow: "hidden",
            mb: 2,
            cursor: "pointer",
            border: "1px solid #e0e0e0",
          }}
          onClick={handlePreview}
        >
          <img
            src={thumbnailUrl || "/placeholder.svg"}
            alt={fileData.name}
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
      )
    } else {
      return (
        <Box
          sx={{
            width: "100%",
            height: "120px",
            borderRadius: "8px",
            mb: 2,
            cursor: "pointer",
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: fileData.type === "application/pdf" ? "#ffebee" : "#e3f2fd",
            color: fileData.type === "application/pdf" ? "#d32f2f" : "#1976d2",
          }}
          onClick={handlePreview}
        >
          {getFileIcon(fileData.type)}
          <Typography variant="caption" sx={{ mt: 1, fontWeight: 500 }}>
            {fileData.type === "application/pdf" ? "PDF" : "DOC"}
          </Typography>
        </Box>
      )
    }
  }

  const renderPreviewContent = () => {
    if (!fileData) return null

    if (previewLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <CircularProgress />
        </Box>
      )
    }

    if (previewError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {previewError}
          </Alert>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={handleDownload} startIcon={<Download />}>
              Download File
            </Button>
            {/* <Button variant="outlined" onClick={handleOpenInNewTab} startIcon={<OpenInNew />}>
              Open in New Tab
            </Button> */}
          </Box>
        </Box>
      )
    }

    if (fileData.type.startsWith("image/")) {
      return (
        <img
          src={fileData.url || "/placeholder.svg"}
          alt={fileData.name}
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
          onError={() => setPreviewError("Failed to load image preview")}
        />
      )
    } else if (fileData.type === "application/pdf") {
      const pdfViewerUrl = getPdfViewerUrl(fileData.url)

      return (
        <Box sx={{ width: "100%", height: "600px" }}>
          <iframe
            src={pdfViewerUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={fileData.name}
            onError={() => {
              setPreviewError("Cannot preview this PDF file. Try downloading or opening in a new tab.")
            }}
          />
        </Box>
      )
    } else {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview not available
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            This file type cannot be previewed directly. You can download it or open it in a new tab.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" onClick={handleDownload} startIcon={<Download />}>
              Download File
            </Button>
            {/* <Button variant="outlined" onClick={handleOpenInNewTab} startIcon={<OpenInNew />}>
              Open in New Tab
            </Button> */}
          </Box>
        </Box>
      )
    }
  }

  return (
    <Box>
      <Typography sx={{ fontWeight: 600, color: "#39353D", fontSize: "14px", mb: 1 }}>{label}</Typography>
      {description && <Typography sx={{ fontSize: "12px", color: "#666", mb: 2 }}>{description}</Typography>}

     <Paper
  sx={{
    border: "2px dashed #D0D5DD",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    minHeight: "250px",
    backgroundColor: fileData ? "#f8f9fa" : "transparent",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: fileData ? "#D0D5DD" : "#1976d2",
      backgroundColor: fileData ? "#f8f9fa" : "#f5f5f5",
    },
  }}
>
  {isUploading ? (
    <Box sx={{ width: "100%", textAlign: "center", minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Typography sx={{ fontSize: "14px", color: "#666", mb: 2 }}>
        Uploading {uploadProgress}%
      </Typography>
      <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />
    </Box>
  ) : fileData ? (
    <Box>
      <Box sx={{ mb: 2 }}>{renderThumbnail()}</Box>
      <Box sx={{ mb: 2 }}>
        <Tooltip title={fileData.name}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#333",
              mb: 0.5,
            }}
          >
            {formatFileName(fileData.name)}
          </Typography>
        </Tooltip>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={fileData.type === "application/pdf" ? "PDF" : fileData.type.split("/")[1]?.toUpperCase()}
            size="small"
            sx={{ fontSize: "10px", height: "20px" }}
          />
          {canPreviewFile(fileData.type, fileData.url) && (
            <Chip label="Previewable" size="small" color="success" sx={{ fontSize: "10px", height: "20px" }} />
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
        {canPreviewFile(fileData.type, fileData.url) && (
          <Button size="small" startIcon={<Visibility />} onClick={handlePreview} sx={{ textTransform: "none" }}>
            Preview
          </Button>
        )}
        <Button size="small" startIcon={<Download />} onClick={handleDownload} sx={{ textTransform: "none" }}>
          Download
        </Button>
        <IconButton size="small" onClick={onRemove} color="error">
          <Delete />
        </IconButton>
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "160px" }}>
      <Box sx={{ width: "100%", height: "120px", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CloudUpload sx={{ fontSize: 48, color: "#D0D5DD" }} />
      </Box>
      <Typography sx={{ fontSize: "14px", color: "#666", mb: 2 }}>Click to upload or drag and drop</Typography>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
        id={`file-input-${label}`}
      />
      <label htmlFor={`file-input-${label}`}>
        <Button component="span" variant="outlined" startIcon={<CloudUpload />} sx={{ textTransform: "none" }}>
          Choose File
        </Button>
      </label>
    </Box>
  )}
</Paper>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: "500px" },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {fileData && getFileIcon(fileData.type)}
          {fileData?.name}
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>{renderPreviewContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button onClick={handleDownload} variant="outlined" startIcon={<Download />}>
            Download
          </Button>
          {/* <Button onClick={handleOpenInNewTab} variant="outlined" startIcon={<OpenInNew />}>
            Open in New Tab
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DocumentUpload