import { useState, useEffect } from "react";
import Icon from "@/@core/component/icon";
import Loader from '@/@core/utils/loader';
import CustomTextField from "@/@core/component/mui/text-field";
import { newJobSchema } from "@/@core/formSchema";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import { createJob } from "@/@core/services/jobService";

interface Props {
  open: boolean;
  close: () => void;
  onJobCreated: () => void;
}

interface IFormInput {
  title: string;
  type: "FULL TIME" | "PART TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  description: string;
  requirement: string;
  responsibilities: string; // New field
  benefits: string; // New field
  about_the_role: string; // New field
  skills: string[];
  location: "Hybrid" | "Remote" | "Onsite";
  currency: "USD" | "EUR" | "GBP" | "NGN";
  minSalary: number;
  maxSalary: number;
  salary_type: "MONTHLY" | "ANNUALLY";
  application_deadline: string;
  information: string | null;
  client_id: string;
}

const defaultValues: IFormInput = {
  title: "",
  type: "FULL TIME",
  description: "",
  requirement: "",
  responsibilities: "", // New field
  benefits: "", // New field
  about_the_role: "", // New field
  skills: [],
  location: "Hybrid",
  salary_type: "MONTHLY",
  currency: "NGN",
  minSalary: undefined as any,
  maxSalary: undefined as any,
  application_deadline: "",
  information: null,
  client_id: "",
};

const currencyMap = {
  NGN: "₦",
  EUR: "€",
  USD: "$",
  GBP: "£",
};

const NewJob = ({ open, close, onJobCreated }: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      fetchClients();
      reset(defaultValues);
    }
  }, [open]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.tbo-taas.com/api/v1/users");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      const clientUsers = data.filter((user: any) => user.account_type === "CLIENT");
      setClients(clientUsers);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<IFormInput>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(newJobSchema),
  });

  const selectedCurrency = watch("currency");

  const submitForm: SubmitHandler<IFormInput> = async (values) => {
    setSubmitting(false);
    try {
      setSubmitting(true);
      const jobData = {
        title: values.title,
        job_type: values.type,
        description: values.description,
        requirements: values.requirement,
        responsibilities: values.responsibilities, // New field
        benefits: values.benefits, // New field
        about_the_role: values.about_the_role, // New field
        skills: values.skills,
        currency: values.currency,
        salary_type: values.salary_type,
        minimum_salary: values.minSalary,
        maximum_salary: values.maxSalary,
        location: values.location,
        application_deadline: values.application_deadline,
        additional_info: values.information,
        client_id: parseInt(values.client_id),
      };

      const response = await createJob(jobData);
      toast.success("Job created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset(defaultValues);
      close();
      onJobCreated();
    } catch (error: any) {
      console.error("Error creating job:", error);
      if (error.message.includes("Error creating job")) {
        try {
          const errorData = JSON.parse(error.message.replace("Error creating job: ", ""));
          const errorMessages = Object.values(errorData.errors || {}).flat().join(", ");
          toast.error(`Failed to create job: ${errorMessages}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } catch {
          toast.error(error.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else if (error.message.includes("not authenticated")) {
        toast.error("You must be logged in to create a job", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Failed to create job. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer />
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
            <Button sx={{ color: "#111" }} onClick={close}>
              <Icon icon="basil:caret-left-solid" fontSize={25} />
            </Button>
            <Typography
              sx={{
                flex: 1,
                textAlign: "center",
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.2rem" },
                mr: "4rem",
              }}
            >
              Add New Job
            </Typography>
          </Box>

          <DialogContent
            sx={{
              pb: (theme) => `${theme.spacing(4)} !important`,
              px: (theme) => [`${theme.spacing(4)} !important`],
              m: (theme) => theme.spacing(3),
              borderRadius: "10px",
              overflowY: "auto",
              maxHeight: "70vh",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", mb: 2 }}>
                Job Details
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Select Company
                  </Typography>
                  <Controller
                    name="client_id"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        size="medium"
                        placeholder="Select a Company..."
                        error={Boolean(errors.client_id)}
                        helperText={errors.client_id?.message || "Please select a Company"}
                        InputProps={{
                          endAdornment: loading ? <CircularProgress size={20} /> : null,
                        }}
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id.toString()}>
                            {client.name} ({client.email})
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Job Title
                  </Typography>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        size="medium"
                        placeholder="e.g., Front Desk Officer"
                        error={Boolean(errors.title)}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Job Type
                  </Typography>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        size="medium"
                        placeholder="Select Job Type"
                        error={Boolean(errors.type)}
                        helperText={errors.type?.message}
                      >
                        <MenuItem value="FULL TIME">Full Time</MenuItem>
                        <MenuItem value="PART TIME">Part Time</MenuItem>
                        <MenuItem value="CONTRACT">Contract</MenuItem>
                        <MenuItem value="INTERNSHIP">Internship</MenuItem>
                        <MenuItem value="FREELANCE">Freelance</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Description
                  </Typography>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Enter job description..."
                        error={Boolean(errors.description)}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Requirements
                  </Typography>
                  <Controller
                    name="requirement"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Enter job requirements..."
                        error={Boolean(errors.requirement)}
                        helperText={errors.requirement?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Responsibilities
                  </Typography>
                  <Controller
                    name="responsibilities"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Enter job responsibilities..."
                        error={Boolean(errors.responsibilities)}
                        helperText={errors.responsibilities?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Benefits
                  </Typography>
                  <Controller
                    name="benefits"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Enter job benefits..."
                        error={Boolean(errors.benefits)}
                        helperText={errors.benefits?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    About the Role
                  </Typography>
                  <Controller
                    name="about_the_role"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Enter details about the role..."
                        error={Boolean(errors.about_the_role)}
                        helperText={errors.about_the_role?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Skills (5–10 required)
                  </Typography>
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(event, newValue) => {
                          if (newValue.length <= 10) {
                            field.onChange(newValue);
                          } else {
                            toast.error("Maximum 10 skills allowed", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            fullWidth
                            size="medium"
                            placeholder="Type a skill and press Enter..."
                            error={Boolean(errors.skills)}
                            helperText={errors.skills?.message || "Add 5–10 skills"}
                            InputProps={{
                              ...params.InputProps,
                              onKeyDown: (event) => {
                                if (event.key === "Enter" && field.value.length >= 10) {
                                  event.preventDefault();
                                  toast.error("Maximum 10 skills allowed", {
                                    position: "top-right",
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                  });
                                }
                              },
                            }}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              sx={{ margin: 0.5 }}
                            />
                          ))
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Salary Type
                  </Typography>
                  <Controller
                    name="salary_type"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        size="medium"
                        placeholder="Select Salary Type"
                        error={Boolean(errors.salary_type)}
                        helperText={errors.salary_type?.message}
                      >
                        <MenuItem value="MONTHLY">Monthly</MenuItem>
                        <MenuItem value="ANNUALLY">Annually</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Currency
                  </Typography>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        size="medium"
                        placeholder="Select Currency"
                        error={Boolean(errors.currency)}
                        helperText={errors.currency?.message}
                        SelectProps={{
                          renderValue: (value) => String(currencyMap[value as keyof typeof currencyMap] || value),
                          MenuProps: {
                            PaperProps: {
                              style: { maxHeight: 300 },
                            },
                            disableScrollLock: true,
                          },
                        }}
                      >
                        {Object.entries(currencyMap).map(([code, symbol]) => (
                          <MenuItem key={code} value={code}>
                            {symbol} ({code})
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Minimum Salary
                  </Typography>
                  <Controller
                    name="minSalary"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        size="medium"
                        placeholder="e.g., 50000"
                        error={Boolean(errors.minSalary)}
                        helperText={errors.minSalary?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {currencyMap[selectedCurrency as keyof typeof currencyMap] || ""}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Maximum Salary
                  </Typography>
                  <Controller
                    name="maxSalary"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        size="medium"
                        placeholder="e.g., 100000"
                        error={Boolean(errors.maxSalary)}
                        helperText={errors.maxSalary?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {currencyMap[selectedCurrency as keyof typeof currencyMap] || ""}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Location
                  </Typography>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        size="medium"
                        placeholder="Select Location"
                        error={Boolean(errors.location)}
                        helperText={errors.location?.message}
                      >
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                        <MenuItem value="Remote">Remote</MenuItem>
                        <MenuItem value="Onsite">Onsite</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Application Deadline
                  </Typography>
                  <Controller
                    name="application_deadline"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        disablePast
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newDate) => {
                          const formattedDate = newDate ? newDate.format("YYYY-MM-DD") : "";
                          field.onChange(formattedDate);
                          setSelectedDate(formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(errors.application_deadline),
                            helperText: errors.application_deadline?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                    Additional Information (Optional)
                  </Typography>
                  <Controller
                    name="information"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                        placeholder="Any additional information..."
                        error={Boolean(errors.information)}
                        helperText={errors.information?.message}
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
              gap: 2,
              pb: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={close}
              sx={{ textTransform: "capitalize", width: "30%" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || submitting}
              sx={{ textTransform: "capitalize", width: "30%" }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Create Job"}
            </Button>
          </DialogActions>
        </form>
        <Loader loading={submitting} />
      </Dialog>
    </div>
  );
};

export default NewJob;