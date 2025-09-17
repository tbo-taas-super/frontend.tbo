import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import { editJobClient } from "@/@core/services/jobService";
import { Job } from "@/@core/utils/job"


const EditJobModal: React.FC<{
  open: boolean;
  job: Job | null;
  close: () => void;
  onJobUpdated: (updatedJob: Job) => void;
}> = ({ open, job, close, onJobUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    about_the_role: "",
    skills: [] as string[],
    currency: "",
    minimum_salary: 0,
    maximum_salary: 0,
    salary_type: "",
    location: "",
    application_deadline: "",
    additional_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        job_type: job.job_type,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities || "",
        benefits: job.benefits || "",
        about_the_role: job.about_the_role || "",
        skills: job.skills || [],
        currency: job.currency,
        minimum_salary: parseFloat(job.minimum_salary),
        maximum_salary: parseFloat(job.maximum_salary),
        salary_type: job.salary_type || "annual",
        location: job.location,
        application_deadline: job.application_deadline.split("T")[0],
        additional_info: job.additional_info || "",
      });
      setSkillsInput(job.skills?.join(", ") || "");
    } else {
      setFormData({
        title: "",
        job_type: "",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        about_the_role: "",
        skills: [],
        currency: "",
        minimum_salary: 0,
        maximum_salary: 0,
        salary_type: "",
        location: "",
        application_deadline: "",
        additional_info: "",
      });
      setSkillsInput("");
    }
  }, [job]);

  // Handler for TextField components
  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setSkillsInput(value);
      setFormData((prev) => ({
        ...prev,
        skills: value
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler for Select components
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!job) return;
    if (formData.skills.length === 0) {
      setError("At least one skill is required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const updatedJob = await editJobClient(job.id, {
        ...formData,
        minimum_salary: Number(formData.minimum_salary),
        maximum_salary: Number(formData.maximum_salary),
      });
      onJobUpdated({
        ...updatedJob.job,
        skills: JSON.parse(updatedJob.job.skill || "[]"),
      });
      close();
    } catch (err: any) {
      setError(err.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleTextFieldChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Job Type</InputLabel>
            <Select
              name="job_type"
              value={formData.job_type}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="FULLTIME">Full Time</MenuItem>
              <MenuItem value="PARTTIME">Part Time</MenuItem>
              <MenuItem value="INTERNSHIP">Internship</MenuItem>
              <MenuItem value="FREELANCE">Freelance</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="About the Role"
            name="about_the_role"
            value={formData.about_the_role}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Skills (comma-separated)"
            name="skills"
            value={skillsInput}
            onChange={handleTextFieldChange}
            fullWidth
            required
            helperText="Enter skills separated by commas (e.g., JavaScript, Python, React)"
          />
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              name="currency"
              value={formData.currency}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="NGN">NGN</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Minimum Salary"
            name="minimum_salary"
            type="number"
            value={formData.minimum_salary}
            onChange={handleTextFieldChange}
            fullWidth
            required
          />
          <TextField
            label="Maximum Salary"
            name="maximum_salary"
            type="number"
            value={formData.maximum_salary}
            onChange={handleTextFieldChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Salary Type</InputLabel>
            <Select
              name="salary_type"
              value={formData.salary_type}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="ANNUALLY">Annual</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleTextFieldChange}
            fullWidth
            required
          />
          <TextField
            label="Application Deadline"
            name="application_deadline"
            type="date"
            value={formData.application_deadline}
            onChange={handleTextFieldChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Additional Information"
            name="additional_info"
            value={formData.additional_info}
            onChange={handleTextFieldChange}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJobModal;