import { useState, useEffect } from "react";
import Icon from "@/@core/component/icon";
import CustomTextField from "@/@core/component/mui/text-field";
import { interviewSchema as baseInterviewSchema } from "@/@core/formSchema";
import * as yup from "yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { scheduleInterview } from "@/@core/services/interviewService";
import { getAppliedJob } from "@/@core/services/jobVanciesService";
import { countryCodes } from "@/@core/utils/data";

// Interface for country code
interface CountryCode {
  code: string;
  country: string;
}

const interviewSchema = baseInterviewSchema.shape({
  jobId: yup.number().min(1, "Please select a job").required("Job is required"),
  applicationId: yup.number().min(1, "Please select a candidate").required("Candidate is required"),
  interviewerPhone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{1,3}\d{7,15}$/, "Phone number must include country code and 7-15 digits"),
  tboRepPhone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{1,3}\d{7,15}$/, "Phone number must include country code and 7-15 digits"),
  information: yup.string().optional(),
  address: yup.string().when("format", {
    is: "In-Person",
    then: (schema) => schema.required("Address is required for in-person interviews"),
    otherwise: (schema) => schema.optional(),
  }),
  interviewDate: yup
    .string()
    .required("Interview date is required")
    .test("is-today-or-future", "Interview date cannot be in the past", (value) => {
      if (!value) return false;
      const selectedDate = dayjs(value);
      const today = dayjs().startOf("day");
      return selectedDate.isSame(today, "day") || selectedDate.isAfter(today, "day");
    }),
  interviewTime: yup
    .string()
    .required("Interview time is required")
    .test("is-not-past-today", "Interview time cannot be in the past for today", function (value) {
      if (!value) return false;
      const selectedDate = dayjs(this.parent.interviewDate);
      const today = dayjs().startOf("day");
      if (selectedDate.isSame(today, "day")) {
        const selectedTime = dayjs(`2023-01-01T${value}`);
        const currentTime = dayjs();
        return selectedTime.isAfter(currentTime);
      }
      return true;
    }),
});

interface Job {
  id: number;
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  skill: string;
  currency: string;
  minimum_salary: string;
  maximum_salary: string;
  location: string;
  application_deadline: string;
  additional_info: string | null;
  created_by: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  applicant_count: number;
  client: Client;
  applications?: Application[];
}

interface Client {
  id: number;
  name: string;
  account_type: string;
  company_logo: string | null;
  company_name: string | null;
  company_email_address: string | null;
  industry: string | null;
  number_of_employees: number | null;
  type_of_employer: string | null;
  company_address: string | null;
  company_phone_number: string | null;
  country: string | null;
  company_website: string | null;
  contact_person: string | null;
  work_email: string | null;
  position_in_company: string | null;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  id_upload: string | null;
  video_url: string | null;
  project_screenshots: string | null;
  work_sample_upload: string | null;
  portfolio_link: string | null;
  profile_image: string | null;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  account_type: string;
  company_logo: string | null;
  company_name: string | null;
  company_email_address: string | null;
  industry: string | null;
  number_of_employees: string | null;
  type_of_employer: string | null;
  company_address: string | null;
  company_phone_number: string | null;
  country: string | null;
  company_website: string | null;
  contact_person: string | null;
  work_email: string | null;
  position_in_company: string | null;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  id_upload: string | null;
  video_url: string | null;
  project_screenshots: string | null;
  work_sample_upload: string | null;
  portfolio_link: string | null;
  profile_image: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  job: Job;
  user: User;
}

interface IFormInput {
  jobId: number;
  applicationId: number;
  userId: number;
  interviewerName: string;
  interviewerDepartment: string;
  interviewerEmail: string;
  interviewerPhone: string;
  interviewDate: string;
  interviewTime: string;
  duration: string;
  format: string;
  information?: string;
  reminder?: string;
  tboRepName: string;
  tboRepEmail: string;
  tboRepPhone: string;
  address?: string;
}

interface InterviewData {
  job_id: number;
  application_id: number;
  user_id: number;
  interview_date: string;
  interview_time: string;
  interview_location: string;
  interviewer_department: string;
  interviewer_name: string;
  interviewer_role: string;
  interviewer_email: string;
  interviewer_phone: string;
  tbo_rep_name: string;
  tbo_rep_email: string;
  tbo_rep_phone: string;
  address?: string;
  status: string;
}

const defaultValues: IFormInput = {
  jobId: 0,
  applicationId: 0,
  userId: 0,
  interviewerName: "",
  interviewerDepartment: "",
  interviewerEmail: "",
  interviewerPhone: "",
  interviewDate: "",
  interviewTime: "",
  duration: "",
  format: "",
  information: "",
  reminder: "",
  tboRepName: "",
  tboRepEmail: "",
  tboRepPhone: "",
  address: "",
};

interface Props {
  open: boolean;
  close: () => void;
  selectedDate: string;
}

const NewInterview = ({ open, close, selectedDate }: Props) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [interviewerCountryCode, setInterviewerCountryCode] = useState<CountryCode>(countryCodes[0]);
  const [tboRepCountryCode, setTboRepCountryCode] = useState<CountryCode>(countryCodes[0]);

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(interviewSchema),
  });

  const selectedJobIdValue = watch("jobId");
  const selectedApplicationId = watch("applicationId");
  const selectedFormat = watch("format");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const applications = await getAppliedJob();
        const jobsMap = new Map<number, Job>();
        (applications as Application[]).forEach((app) => {
          if (!jobsMap.has(app.job_id)) {
            jobsMap.set(app.job_id, {
              ...app.job,
              applications: [] as Application[],
            });
          }
          const job = jobsMap.get(app.job_id);
          if (job) {
            if (!job.applications) {
              job.applications = [];
            }
            job.applications.push(app);
          }
        });
        setJobs(Array.from(jobsMap.values()));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchJobs();
    }
  }, [open]);

  useEffect(() => {
    if (selectedApplicationId) {
      const selectedApp = jobs
        .flatMap((job) => job.applications)
        .find((app) => app && app.id === selectedApplicationId);
      if (selectedApp) {
        setValue("userId", selectedApp.user_id);
      }
    }
  }, [selectedApplicationId, jobs, setValue]);

  const filteredApplications = jobs.find((job) => job.id === selectedJobIdValue)?.applications || [];

  const submitForm: SubmitHandler<IFormInput> = async (values) => {
    try {
      const formattedData: InterviewData = {
        job_id: values.jobId,
        application_id: values.applicationId,
        user_id: values.userId,
        interview_date: values.interviewDate,
        interview_time: values.interviewTime,
        interview_location: values.format,
        interviewer_department: values.interviewerDepartment,
        interviewer_name: values.interviewerName,
        interviewer_role: "",
        interviewer_email: values.interviewerEmail,
        interviewer_phone: values.interviewerPhone,
        tbo_rep_name: values.tboRepName,
        tbo_rep_email: values.tboRepEmail,
        tbo_rep_phone: values.tboRepPhone,
        address: values.format === "In-Person" ? values.address : undefined,
        status: "scheduled",
      };
      const response = await scheduleInterview(formattedData);
      console.log("Interview scheduled successfully:", response);
      alert("Interview scheduled successfully!");
      reset();
      setSelectedJobId(0);
      setInterviewerCountryCode(countryCodes[0]);
      setTboRepCountryCode(countryCodes[0]);
      close();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview. Please try again.");
    }
  };

  const handlePhoneChange = (
    value: string,
    countryCode: string,
    onChange: (value: string) => void
  ) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const fullPhoneNumber = `${countryCode}${cleanedValue}`;
    onChange(fullPhoneNumber);
  };

  return (
    <Dialog
      disableScrollLock
      open={open}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          minWidth: { md: 800 },
          borderRadius: "8px",
          mx: "auto",
        },
      }}
    >
      <form onSubmit={handleSubmit(submitForm)}>
        <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
          <Button onClick={close} sx={{ color: "#111" }}>
            <Icon icon="basil:caret-left-solid" fontSize={25} />
          </Button>
          <Typography
            sx={{
              flex: 1,
              textAlign: "center",
              fontWeight: 600,
              mx: 1,
              fontSize: { xs: "1rem", md: "1.2rem" },
              mr: "4rem",
            }}
          >
            Schedule Interview
          </Typography>
        </Box>

        <DialogContent
          sx={(theme) => ({
            pb: `${theme.spacing(4)} !important`,
            px: `${theme.spacing(4)} !important`,
            m: theme.spacing(3),
            borderRadius: "10px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          })}
        >
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Candidate Details</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Select Job
                </Typography>
                <Controller
                  name="jobId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        setSelectedJobId(Number(e.target.value));
                        setValue("applicationId", 0);
                        setValue("userId", 0);
                      }}
                      size="medium"
                      select
                      disabled={loading}
                      error={Boolean(errors.jobId)}
                      helperText={errors.jobId?.message}
                    >
                      <MenuItem value={0} disabled>
                        {loading ? "Loading Jobs..." : "Select a Job"}
                      </MenuItem>
                      {jobs.map((job) => (
                        <MenuItem key={job.id} value={job.id}>
                          {job.title}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Select Candidate
                </Typography>
                <Controller
                  name="applicationId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      options={filteredApplications}
                      getOptionLabel={(option) => `${option.user.name} - ${option.user.email}`}
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id : 0);
                      }}
                      disabled={loading || !selectedJobIdValue}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          size="medium"
                          placeholder="Search for a candidate..."
                          error={Boolean(errors.applicationId)}
                          helperText={errors.applicationId?.message}
                        />
                      )}
                      noOptionsText={selectedJobIdValue ? "No candidates available" : "Select a job first"}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Interviewer Information</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Interviewer Name
                </Typography>
                <Controller
                  name="interviewerName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      placeholder="John Doe"
                      error={Boolean(errors.interviewerName)}
                      helperText={errors.interviewerName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Department
                </Typography>
                <Controller
                  name="interviewerDepartment"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      placeholder="HR Management"
                      error={Boolean(errors.interviewerDepartment)}
                      helperText={errors.interviewerDepartment?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Email Address
                </Typography>
                <Controller
                  name="interviewerEmail"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      placeholder="johndoe@example.com"
                      error={Boolean(errors.interviewerEmail)}
                      helperText={errors.interviewerEmail?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Phone Number
                </Typography>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <Autocomplete
                      options={countryCodes}
                      getOptionLabel={(option) => `${option.code} (${option.country})`}
                      value={interviewerCountryCode}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setInterviewerCountryCode(newValue);
                          const currentPhone = watch("interviewerPhone") || "";
                          const cleanedPhone = currentPhone.replace(/^\+\d{1,3}/, "");
                          setValue("interviewerPhone", `${newValue.code}${cleanedPhone}`);
                        }
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          size="medium"
                          placeholder="Select country code"
                          error={Boolean(errors.interviewerPhone)}
                        />
                      )}
                      sx={{
                        "& .MuiAutocomplete-option": {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          color: "#333",
                        },
                        "& .MuiAutocomplete-option:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& .MuiAutocomplete-option.Mui-focused": {
                          backgroundColor: "#e0e0e0",
                        },
                        "& .MuiAutocomplete-inputRoot": { paddingRight: "30px !important" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="interviewerPhone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value ? value.replace(interviewerCountryCode.code, "") : ""}
                          onChange={(e) => handlePhoneChange(e.target.value, interviewerCountryCode.code, onChange)}
                          size="medium"
                          placeholder="Enter phone number"
                          error={Boolean(errors.interviewerPhone)}
                          helperText={errors.interviewerPhone?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">{interviewerCountryCode.code}</InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Interview Details</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Interview Date
                </Typography>
                <Controller
                  name="interviewDate"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value ? dayjs(value) : null}
                      onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                      minDate={dayjs().startOf("day")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "medium",
                          error: Boolean(errors.interviewDate),
                          helperText: errors.interviewDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Interview Time
                </Typography>
                <Controller
                  name="interviewTime"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TimeField
                      value={value ? dayjs(`2023-01-01T${value}`) : null}
                      onChange={(time) => onChange(time ? time.format("HH:mm:ss") : "")}
                      format="HH:mm:ss"
                      minTime={
                        dayjs(watch("interviewDate")).isSame(dayjs().startOf("day"), "day")
                          ? dayjs()
                          : undefined
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "medium",
                          error: Boolean(errors.interviewTime),
                          helperText: errors.interviewTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Duration
                </Typography>
                <Controller
                  name="duration"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      select
                      error={Boolean(errors.duration)}
                      helperText={errors.duration?.message}
                    >
                      <MenuItem value="30">30 minutes</MenuItem>
                      <MenuItem value="60">1 hour</MenuItem>
                      <MenuItem value="90">1.5 hours</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Interview Format
                </Typography>
                <Controller
                  name="format"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      select
                      error={Boolean(errors.format)}
                      helperText={errors.format?.message}
                    >
                      <MenuItem value="In-Person">In-Person</MenuItem>
                      <MenuItem value="Virtual">Virtual</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              {selectedFormat === "In-Person" && (
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                    Interview Address
                  </Typography>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="Enter the interview address"
                        error={Boolean(errors.address)}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>TBO Representative Information</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  TBO Representative Name
                </Typography>
                <Controller
                  name="tboRepName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      placeholder="Jane Smith"
                      error={Boolean(errors.tboRepName)}
                      helperText={errors.tboRepName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  TBO Email Address
                </Typography>
                <Controller
                  name="tboRepEmail"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      placeholder="janesmith@example.com"
                      error={Boolean(errors.tboRepEmail)}
                      helperText={errors.tboRepEmail?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  TBO Phone Number
                </Typography>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <Autocomplete
                      options={countryCodes}
                      getOptionLabel={(option) => `${option.code} (${option.country})`}
                      value={tboRepCountryCode}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setTboRepCountryCode(newValue);
                          const currentPhone = watch("tboRepPhone") || "";
                          const cleanedPhone = currentPhone.replace(/^\+\d{1,3}/, "");
                          setValue("tboRepPhone", `${newValue.code}${cleanedPhone}`);
                        }
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          size="medium"
                          placeholder="Select country code"
                          error={Boolean(errors.tboRepPhone)}
                        />
                      )}
                      sx={{
                        "& .MuiAutocomplete-option": {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          color: "#333",
                        },
                        "& .MuiAutocomplete-option:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& .MuiAutocomplete-option.Mui-focused": {
                          backgroundColor: "#e0e0e0"
                        },
                        "& .MuiAutocomplete-inputRoot": { paddingRight: "30px !important" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="tboRepPhone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value ? value.replace(tboRepCountryCode.code, "") : ""}
                          onChange={(e) => handlePhoneChange(e.target.value, tboRepCountryCode.code, onChange)}
                          size="medium"
                          placeholder="Enter phone number"
                          error={Boolean(errors.tboRepPhone)}
                          helperText={errors.tboRepPhone?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">{tboRepCountryCode.code}</InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", mb: "10px" }}>
                  Additional Information (Optional)
                </Typography>
                <Controller
                  name="information"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      size="medium"
                      multiline
                      rows={3}
                      placeholder="Any additional details..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ textTransform: "capitalize", width: "30%", mb: 4 }}
            disabled={isSubmitting || !selectedApplicationId}
          >
            Schedule Interview
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewInterview;