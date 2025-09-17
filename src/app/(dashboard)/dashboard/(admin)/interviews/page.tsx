"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import NewInterview from "./NewInterview" 
import { fetchInterviews, updateInterviewStatus } from "@/@core/services/interviewService"

// Define types for API responses
interface InterviewRaw {
  id: number
  job_id?: number
  application_id?: number
  qualified_user?: { id: number; name: string }
  job: string
  interview_date: string
  interview_time: string
  interview_location?: string
  address?: string
  interviewer?: { name: string }
  status: string
}

interface FetchInterviewsResponse {
  interviews: InterviewRaw[]
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

interface Interview {
  id: number
  job_id: number
  application_id: number
  user_id: number
  jobTitle: string
  candidateName: string
  interview_date: string
  interview_time: string
  interview_location: string
  interviewer_name: string
  status: string
}

// Format date to YYYY-MM-DD in local time zone
const formatLocalDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date provided to formatLocalDate:", date)
    return ""
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function InterviewsPage() {
  const [currentDate, setCurrentDate] = useState(new Date()) // Use current date
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date())) // Use current date in YYYY-MM-DD format
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Debug component rendering
  useEffect(() => {
    console.log("InterviewsPage component rendered")
  }, [])

  // Fetch interviews on mount and when needed
  const fetchInterviewData = async () => {
    setLoading(true)
    try {
      const response = (await fetchInterviews()) as FetchInterviewsResponse
      const fetchedInterviews: Interview[] = response.interviews.map((interview) => ({
        id: interview.id,
        job_id: interview.job_id ?? 0,
        application_id: interview.application_id ?? 0,
        user_id: interview.qualified_user?.id ?? 0,
        jobTitle: interview.job || "Unknown Job",
        candidateName: interview.qualified_user?.name || "Unknown Candidate",
        interview_date: interview.interview_date,
        interview_time: interview.interview_time,
        interview_location: interview.interview_location || interview.address || "Unknown Location",
        interviewer_name: interview.interviewer?.name || "Unknown Interviewer",
        status: interview.status.charAt(0).toUpperCase() + interview.status.slice(1).toLowerCase(),
      }))
      setInterviews(fetchedInterviews)
      console.log("Fetched interviews:", fetchedInterviews)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to fetch interviews")
      console.error("Error fetching interviews:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviewData()
  }, [])

  // Filter interviews by selected date
  const filteredInterviews = useMemo(() => {
    console.log("Filtering interviews for selectedDate:", selectedDate)
    return interviews.filter((interview) => interview.interview_date === selectedDate)
  }, [interviews, selectedDate])

  // Calculate pagination
  const totalInterviews = filteredInterviews.length
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalInterviews)

  // Generate calendar days for horizontal carousel (90 days before and 90 days after currentDate, total 181 days)
  const generateCarouselDays = () => {
    const days = []
    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() - 90) // 90 days before currentDate

    for (let i = 0; i < 181; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dayOfWeek = (date.getDay() + 6) % 7
      const dayName = dayNames[dayOfWeek]
      const dateString = formatLocalDate(date)
      if (!dateString) continue // Skip invalid dates
      days.push({
        date,
        day: date.getDate(),
        dayName,
        dateString,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      })
    }
    console.log("Generated carousel days:", days.map((d) => ({ day: d.day, dateString: d.dateString })))
    return days
  }

  const handleDateClick = (dateString: string) => {
    console.log("Date clicked:", dateString)
    setSelectedDate(dateString)
    const clickedDate = new Date(dateString)
    if (isNaN(clickedDate.getTime())) {
      console.error("Invalid date clicked:", dateString)
      setError("Invalid date selected")
      return
    }
    setCurrentDate(new Date(clickedDate.getFullYear(), clickedDate.getMonth(), 1))
    setCurrentPage(1) // Reset to first page when date changes

    // Scroll to the selected date
    if (scrollContainerRef.current && scrollContainerRef.current.offsetWidth > 0) {
      const carouselDays = generateCarouselDays()
      const selectedIndex = carouselDays.findIndex((day) => day.dateString === dateString)
      if (selectedIndex !== -1) {
        const dayWidth = 80 + 16 // Width of each day box (80px) + gap (16px from gap: 2)
        const scrollPosition = selectedIndex * dayWidth - scrollContainerRef.current.offsetWidth / 2 + dayWidth / 2
        scrollContainerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
      }
    }
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(newDate)
    const currentDay = new Date(selectedDate).getDate()
    const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
    const newDay = Math.min(currentDay, daysInNewMonth) // Preserve day if possible, else use last day of month
    setSelectedDate(formatLocalDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDay)))
    setCurrentPage(1) // Reset to first page
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(newDate)
    const currentDay = new Date(selectedDate).getDate()
    const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
    const newDay = Math.min(currentDay, daysInNewMonth) // Preserve day if possible, else use last day of month
    setSelectedDate(formatLocalDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDay)))
    setCurrentPage(1) // Reset to first page
  }

  // Scroll to center the current month's first day when currentDate changes
  useEffect(() => {
    if (scrollContainerRef.current && scrollContainerRef.current.offsetWidth > 0) {
      const carouselDays = generateCarouselDays()
      const firstDayOfMonth = formatLocalDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
      const selectedIndex = carouselDays.findIndex((day) => day.dateString === firstDayOfMonth)
      if (selectedIndex !== -1) {
        const dayWidth = 80 + 16 // Width of each day box (80px) + gap (16px from gap: 2)
        const scrollPosition = selectedIndex * dayWidth - scrollContainerRef.current.offsetWidth / 2 + dayWidth / 2
        scrollContainerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
      }
    }
  }, [currentDate])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { bgcolor: "#ECFDF5", color: "#065F46" }
      case "scheduled":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" }
      case "in progress":
        return { bgcolor: "#FFFBEB", color: "#92400E" }
      case "cancelled":
        return { bgcolor: "#FEF2F2", color: "#991B1B" }
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" }
    }
  }

  const handleOpenModal = () => {
    console.log("Opening modal")
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    fetchInterviewData() // Refresh interviews after closing modal
  }

  const handleRefresh = () => {
    fetchInterviewData()
  }

  const handleStatusChange = async (interviewId: number, newStatus: string) => {
    try {
      await updateInterviewStatus(interviewId, newStatus.toLowerCase())
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId ? { ...interview, status: newStatus } : interview
        )
      )
    } catch (err: any) {
      console.error("Error updating status:", err)
      setError("Failed to update interview status")
    }
  }

  const carouselDays = generateCarouselDays()

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Interview Calendar
        </Typography>
      </Box>

      {/* Schedule Button */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#E61C31",
            "&:hover": {
              bgcolor: "#C91A2A",
            },
            zIndex: 10,
          }}
          onClick={handleOpenModal}
        >
          Schedule New Interview
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Calendar Carousel Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={handlePrevMonth} sx={{ color: "#E61C31" }}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNextMonth} sx={{ color: "#E61C31" }}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 2,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 3 },
              "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: 3 },
              "&::-webkit-scrollbar-thumb:hover": { background: "#a8a8a8" },
            }}
          >
            {carouselDays.map((dayInfo, index) => {
              const isSelected = dayInfo.dateString === selectedDate
              const hasInterview = interviews.some(
                (interview) => interview.interview_date === dayInfo.dateString
              )
              return (
                <Box
                  key={index}
                  onClick={() => handleDateClick(dayInfo.dateString)}
                  sx={{
                    minWidth: 80,
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: 3,
                    border: isSelected ? "2px solid #E61C31" : "1px solid #E5E7EB",
                    bgcolor: hasInterview ? "#FEF2F2" : "white",
                    opacity: dayInfo.isCurrentMonth ? 1 : 0.6,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isSelected ? "#FEF2F2" : "#F9FAFB",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary", mb: 0.5 }}>
                    {dayInfo.dayName}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#E61C31" : "text.primary",
                      fontSize: "1.25rem",
                    }}
                  >
                    {dayInfo.day}
                  </Typography>
                  {hasInterview && (
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#E61C31", mt: 0.5 }} />
                  )}
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Interviews Section */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#E61C31" }}>
              Interviews
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                color: "#E61C31",
                borderColor: "#E61C31",
                "&:hover": { borderColor: "#E61C31", bgcolor: "#FEF2F2" },
              }}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#FEF2F2" }}>
                <TableRow>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Job</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Candidate</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Interview Date</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Interviewer</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: "#E61C31", fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredInterviews.length > 0 ? (
                  filteredInterviews.slice(startIndex, endIndex).map((interview) => (
                    <TableRow key={interview.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{interview.jobTitle}</TableCell>
                      <TableCell>{interview.candidateName}</TableCell>
                      <TableCell>{interview.interview_date}</TableCell>
                      <TableCell>{interview.interview_time}</TableCell>
                      <TableCell>{interview.interview_location}</TableCell>
                      <TableCell>{interview.interviewer_name}</TableCell>
                      <TableCell>
                        <Select
                          value={interview.status}
                          onChange={(e) => handleStatusChange(interview.id, e.target.value)}
                          size="small"
                          sx={{ ...getStatusColor(interview.status), fontSize: "0.875rem" }}
                        >
                          <MenuItem value="Scheduled">Scheduled</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: "#E61C31" }}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No interviews scheduled for {selectedDate}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Rows per page:</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {startIndex + 1}-{endIndex} of {totalInterviews}
              </Typography>
              <IconButton size="small" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                size="small"
                disabled={endIndex >= totalInterviews}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <NewInterview open={openModal} close={handleCloseModal} selectedDate={selectedDate} />
    </Box>
  )
}