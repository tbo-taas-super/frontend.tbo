/**
 * Fixed Cloudinary URL transformation utilities
 */

export interface CloudinaryUrlInfo {
  isCloudinary: boolean
  cloudName?: string
  publicId?: string
  resourceType?: string
  version?: string
  originalUrl: string
}

export const parseCloudinaryUrl = (url: string): CloudinaryUrlInfo => {
  const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video|raw)\/upload\/(?:v(\d+)\/)?(.+)/
  const match = url.match(cloudinaryRegex)

  if (match) {
    return {
      isCloudinary: true,
      cloudName: match[1],
      resourceType: match[2],
      version: match[3],
      publicId: match[4],
      originalUrl: url,
    }
  }

  return {
    isCloudinary: false,
    originalUrl: url,
  }
}

export const getCloudinaryPreviewUrl = (url: string, fileType: string): string => {
  const urlInfo = parseCloudinaryUrl(url)

  if (!urlInfo.isCloudinary || !urlInfo.publicId) {
    return url
  }

  const { cloudName, publicId, version } = urlInfo
  const versionPart = version ? `v${version}/` : ""

  // For PDFs uploaded as raw, we can try to access them as PDFs
  if (fileType === "application/pdf") {
    // Try to access as PDF first (this might work if the original file was a PDF)
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${versionPart}${publicId}`
  }

  // For images, try to access as image resource
  if (fileType.startsWith("image/")) {
    // If it was uploaded as raw but is actually an image, try image delivery
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_800,h_600,c_fit/${versionPart}${publicId}`
  }

  // For other files, return the raw URL
  return url
}

export const getCloudinaryThumbnail = (url: string, fileType: string): string => {
  const urlInfo = parseCloudinaryUrl(url)

  if (!urlInfo.isCloudinary || !urlInfo.publicId) {
    return "/placeholder.svg?height=120&width=120"
  }

  const { cloudName, publicId, version } = urlInfo
  const versionPart = version ? `v${version}/` : ""

  // For PDFs, we can't generate thumbnails from raw uploads
  // Return a PDF icon placeholder
  if (fileType === "application/pdf") {
    return "/placeholder.svg?height=120&width=120&text=PDF"
  }

  // For images uploaded as raw, try to access as image
  if (fileType.startsWith("image/")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_200,h_150,c_fill/${versionPart}${publicId}`
  }

  return "/placeholder.svg?height=120&width=120"
}

// Helper to create a proper PDF viewer URL
export const getPdfViewerUrl = (url: string): string => {
  // For raw Cloudinary URLs, we'll use Google Docs viewer or PDF.js
  const encodedUrl = encodeURIComponent(url)

  // Option 1: Google Docs Viewer (works well but requires internet)
  return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`

  // Option 2: You could also use PDF.js viewer
  // return `/pdf-viewer?file=${encodedUrl}`
}

// Helper to determine if a file can be previewed
export const canPreviewFile = (fileType: string, url: string): boolean => {
  const urlInfo = parseCloudinaryUrl(url)

  // Images can usually be previewed
  if (fileType.startsWith("image/")) {
    return true
  }

  // PDFs can be previewed using external viewers
  if (fileType === "application/pdf") {
    return true
  }

  // Other document types are harder to preview from raw uploads
  return false
}
