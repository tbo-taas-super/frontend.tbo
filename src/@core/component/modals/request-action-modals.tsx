"use client";

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
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  MenuItem,
  Checkbox,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { AdminRequestsData } from "@/@core/services/AdminPool";
import { sendMessage } from "@/@core/services/AdminPool";
import { uploadFile } from "@/@core/services/user";
import { getSession } from "next-auth/react";

interface RequestViewModalProps {
  request: AdminRequestsData["requests"][0];
  open: boolean;
  onClose: () => void;
}

export function RequestViewModal({ request, open, onClose }: RequestViewModalProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [contactType, setContactType] = useState<"client" | "talent" | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hired":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Processing":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" };
      case "Cancelled":
        return { bgcolor: "#FEF2F2", color: "#991B1B" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const handleOpenContactModal = (type: "client" | "talent") => {
    setContactType(type);
    setContactModalOpen(true);
  };

  const handleMessageSent = (success: boolean, message: string) => {
    console.log("Message sent:", { success, message });
  };

  const handleCancelConfirm = (reason: string) => {
    console.log("Request cancelled with reason:", reason);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="request-view-dialog-title">
      <DialogTitle id="request-view-dialog-title">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Request Details</span>
          <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            {/* Request Details */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Request Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WorkIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">
                          <strong>Job Title:</strong> {request.job_title || ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">
                          <strong>Created At:</strong>{" "}
                          {request.request_date
                            ? new Date(request.request_date).toLocaleDateString()
                            : ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BusinessIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">
                          <strong>Client:</strong>{" "}
                          {request.client?.company_name || ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">
                          <strong>Talent:</strong> {request.talent?.name || ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Chip
                        label={request.status || "Unknown"}
                        sx={{
                          ...getStatusColor(request.status || ""),
                          fontWeight: "bold",
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Messages Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Messages
                  </Typography>
                  {request.messages && request.messages.length > 0 ? (
                    request.messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{ mb: 2, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {msg.message_text}
                        </Typography>
                        {msg.attachment_url && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <a
                              href={msg.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Attachment (PDF)
                            </a>
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Sent on {new Date(msg.sent_at).toLocaleString()} - Status: {msg.status}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No messages available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={() => handleOpenContactModal("client")}
          disabled={!request.client}
        >
          Contact Client
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleOpenContactModal("talent")}
          disabled={!request.talent}
        >
          Contact Talent
        </Button>
        {/* <Button
          variant="outlined"
          onClick={() => setScheduleModalOpen(true)}
          disabled={!request.talent || !request.client}
        >
          Schedule Interview
        </Button> */}
        {/* <Button
          variant="outlined"
          color="error"
          onClick={() => setCancelModalOpen(true)}
          disabled={request.status === "Cancelled"}
        >
          Cancel Request
        </Button> */}
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

      {/* Related Modals */}
      {contactType && (
        <ContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title={`Contact ${contactType === "client" ? "Client" : "Talent"}`}
          contactName={
            contactType === "client"
              ? request.client?.company_name || ""
              : request.talent?.name || ""
          }
          contactEmail={
            contactType === "client"
              ? request.client?.company_email_address || ""
              : request.talent?.email || ""
          }
          contactPhone={
            contactType === "client"
              ? request.client?.company_phone || ""
              : request.talent?.phone_number || ""
          }
          receiverId={
            contactType === "client" ? request.client?.id || 0 : request.talent?.id || 0
          }
          requestId={request.id}
          isTalent={contactType === "talent"}
          onMessageSent={handleMessageSent}
        />
      )}
      <ScheduleInterviewModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        request={request}
      />
      <CancelRequestModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        request={request}
        onConfirm={handleCancelConfirm}
      />
    </Dialog>
  );
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  receiverId: number;
  requestId: number;
  isTalent: boolean;
  onMessageSent: (success: boolean, message: string) => void;
}

export function ContactModal({
  open,
  onClose,
  title,
  contactName,
  contactEmail,
  contactPhone,
  receiverId,
  requestId,
  isTalent,
  onMessageSent,
}: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      console.log("Selected file:", selectedFile.name, selectedFile.type, selectedFile.size);
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Message is required");
      onMessageSent(false, "Message is required");
      return;
    }

    try {
      setLoading(true);
      let attachmentUrl: string | null = null;

      if (isTalent && file) {
        console.log("Uploading file:", file.name);
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await uploadFile(formData, (progress) => {
          setUploadProgress(progress);
          console.log("Upload progress:", progress);
        });
        console.log("Upload response:", uploadResponse);
        if (!uploadResponse?.url) {
          throw new Error("File upload failed: No URL returned");
        }
        attachmentUrl = uploadResponse.url;
        console.log("Attachment URL:", attachmentUrl);
      }

      const session = await getSession();
      const senderId = session?.user?.id;

      if (!senderId) {
        throw new Error("Sender not authenticated");
      }

      console.log("Sending message with:", { requestId, receiverId, message, attachmentUrl, sendEmail });
      const response = await sendMessage(requestId, receiverId, message, attachmentUrl, isTalent ? sendEmail : false);
      console.log("Send message response:", response);

      setMessage("");
      setFile(null);
      setSendEmail(false);
      setUploadProgress(null);
      setError(null);
      onMessageSent(true, `Message sent to ${contactName} successfully`);
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || (err instanceof Error ? err.message : "Failed to send message");
      setError(errorMessage);
      console.error("Error in handleSendMessage:", errorMessage);
      onMessageSent(false, errorMessage);
      if (err.response?.data?.data?.id) {
        setMessage("");
        setFile(null);
        setSendEmail(false);
        setUploadProgress(null);
        onMessageSent(true, `Message stored but email failed for ${contactName}`);
        onClose();
      }
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="contact-dialog-title">
      <DialogTitle id="contact-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Send a message to {contactName}:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ color: "text.secondary" }} />
              <Typography variant="body2">{contactEmail}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ color: "text.secondary" }} />
              <Typography variant="body2">{contactPhone}</Typography>
            </Box>
            {isTalent && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2">Attach PDF (e.g., Offer Letter):</Typography>
                <TextField
                  type="file"
                  inputProps={{ accept: "application/pdf" }}
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {file && (
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Selected: {file.name}
                  </Typography>
                )}
                {uploadProgress !== null && (
                  <Typography variant="caption">
                    Upload Progress: {uploadProgress}%
                  </Typography>
                )}
              </Box>
            )}
            {isTalent && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    disabled={loading || !file}
                  />
                }
                label="Send as email attachment"
              />
            )}
          </Box>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            error={!!error}
            helperText={error}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          startIcon={<SendIcon />}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  request: AdminRequestsData["requests"][0];
}

export function ScheduleInterviewModal({ open, onClose, request }: ScheduleInterviewModalProps) {
  const [formData, setFormData] = useState({
    selectedJob: request.job_title || "",
    selectedCandidate: request.talent?.name || "",
    interviewerName: "",
    department: "",
    emailAddress: request.client?.company_email_address || "",
    phoneNumber: request.client?.company_phone || "",
    interviewDate: "",
    interviewTime: "",
    duration: "",
    interviewFormat: "",
    tboRepName: "",
    tboEmail: "",
    tboPhone: "",
    additionalInfo: "",
  });

  const jobs = [
    { id: "JOB001", title: "Senior Software Engineer" },
    { id: "JOB002", title: "UX Designer" },
    { id: "JOB003", title: "Data Scientist" },
    { id: "JOB004", title: "Product Manager" },
  ];

  const candidates = [
    { id: "CAND001", name: "Sarah Johnson" },
    { id: "CAND002", name: "Michael Chen" },
    { id: "CAND003", name: "Emily Rodriguez" },
    { id: "CAND004", name: "David Kim" },
    { id: request.talent?.id.toString() || "", name: request.talent?.name || "" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Scheduling interview:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="schedule-interview-dialog-title">
      <DialogTitle id="schedule-interview-dialog-title">Schedule Interview</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Schedule an interview for {request.talent?.name || ""} with {request.client?.company_name || ""}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Job</InputLabel>
                <Select
                  value={formData.selectedJob}
                  label="Select Job"
                  onChange={(e) => handleInputChange("selectedJob", e.target.value)}
                >
                  {jobs.concat({ id: request.job_title || "", title: request.job_title || "" }).map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Candidate</InputLabel>
                <Select
                  value={formData.selectedCandidate}
                  label="Select Candidate"
                  onChange={(e) => handleInputChange("selectedCandidate", e.target.value)}
                >
                  {candidates.map((candidate) => (
                    <MenuItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Interviewer Name"
                fullWidth
                value={formData.interviewerName}
                onChange={(e) => handleInputChange("interviewerName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                fullWidth
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={formData.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Interview Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.interviewDate}
                onChange={(e) => handleInputChange("interviewDate", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Interview Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.interviewTime}
                onChange={(e) => handleInputChange("interviewTime", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={formData.duration}
                  label="Duration"
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                >
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="45">45 minutes</MenuItem>
                  <MenuItem value="60">1 hour</MenuItem>
                  <MenuItem value="90">1.5 hours</MenuItem>
                  <MenuItem value="120">2 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Interview Format</InputLabel>
                <Select
                  value={formData.interviewFormat}
                  label="Interview Format"
                  onChange={(e) => handleInputChange("interviewFormat", e.target.value)}
                >
                  <MenuItem value="video">Video Call</MenuItem>
                  <MenuItem value="phone">Phone Call</MenuItem>
                  <MenuItem value="in-person">In Person</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, mt: 2, color: "primary.main" }}>
                TBO Representative Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="TBO Representative Name"
                fullWidth
                value={formData.tboRepName}
                onChange={(e) => handleInputChange("tboRepName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="TBO Email Address"
                type="email"
                fullWidth
                value={formData.tboEmail}
                onChange={(e) => handleInputChange("tboEmail", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="TBO Phone Number"
                fullWidth
                value={formData.tboPhone}
                onChange={(e) => handleInputChange("tboPhone", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Information (Optional)"
                fullWidth
                multiline
                rows={3}
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any additional notes or requirements for the interview..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Schedule Interview
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface CancelRequestModalProps {
  open: boolean;
  onClose: () => void;
  request: AdminRequestsData["requests"][0];
  onConfirm: (reason: string) => void;
}

export function CancelRequestModal({ open, onClose, request, onConfirm }: CancelRequestModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="cancel-request-dialog-title">
      <DialogTitle id="cancel-request-dialog-title">Cancel Request</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to cancel the request for <strong>{request.talent?.name || ""}</strong> for the position of{" "}
            <strong>{request.job_title || ""}</strong> at <strong>{request.client?.company_name || ""}</strong>?
          </Typography>
          <TextField
            label="Cancellation Reason"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Keep Request</Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={!reason.trim()}>
          Cancel Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}