// *React Imports
import { useState } from "react";

// *Icon Imports
import Icon from "@/@core/component/icon";

// *Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";

// *Utility Imports
import { newJobSchemaClone } from "@/@core/formSchema";

// *Third Party Imports
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// *MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { Autocomplete, IconButton, TextFieldProps } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface Props {
  open: boolean;
  close: () => void;
}

interface IFormInput {
  title: string;
  type: string;
  description: string;
  requirement: string;
  skills: string[];
  location: string;
  currency: string;
  minSalary: string;
  maxSalary: string;
  information: string;
  responsibilities: string; // Add this field
  benefits: string; // Add this field
  about_the_role: string; // Add this field
}

const defaultValues = {
  title: "",
  type: "",
  description: "",
  requirement: "",
  skills: [],
  location: "",
  currency: "",
  minSalary: "",
  maxSalary: "",
  information: "",
};

const availableSkills = [
  "JavaScript",
  "React",
  "TypeScript",
  "CSS",
  "HTML",
  "Node.js",
  "Python",
];

const AddEvent = ({ open, close }: Props) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>("");

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(newJobSchemaClone),
  });

  const submitForm: SubmitHandler<IFormInput> = (values) => {
    console.log(values);
  };

  return (
    <div>
      <Dialog
        disableScrollLock
        open={open}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            minWidth: { md: 600 },
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
                fontSize: { xs: "1rem", md: "1.2rem" },
                mr: "4rem",
              }}
            >
              Add Event
            </Typography>
          </Box>

          <DialogContent
            sx={{
              pb: (theme) => `${theme.spacing(4)} !important`,
              px: (theme) => [`${theme.spacing(4)} !important`],
              m: (theme) => theme.spacing(3),
              borderRadius: "10px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box sx={{ mb: 4 }}>
              {/* <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Job Title
                  </Typography>

                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="Front Desk..."
                        error={Boolean(errors.title)}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Job Type
                  </Typography>

                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        select
                        placeholder="ABC Holdings..."
                        error={Boolean(errors.type)}
                        helperText={errors.type?.message}
                      >
                        <MenuItem value="full-time">Full Time</MenuItem>
                        <MenuItem value="part-time">Part Time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                        <MenuItem value="internship">Internship</MenuItem>
                        <MenuItem value="freelance">Freelance</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Description
                  </Typography>

                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={5}
                        value={value}
                        onChange={onChange}
                        size="medium"
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            "& textarea": {
                              overflow: "hidden",
                              resize: "none",
                            },
                          },
                        }}
                        placeholder="Enter job description..."
                        error={Boolean(errors.description)}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Requirements
                  </Typography>

                  <Controller
                    name="requirement"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={5}
                        value={value}
                        onChange={onChange}
                        size="medium"
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            "& textarea": {
                              overflow: "hidden",
                              resize: "none",
                            },
                          },
                        }}
                        placeholder="Enter job requirements..."
                        error={Boolean(errors.requirement)}
                        helperText={errors.requirement?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Skills
                  </Typography>

                  <Controller
                    name="skills"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={availableSkills}
                        value={value}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderTags={(value: string[], getTagProps) =>
                          value.map((option, index) => {
                            const tagProps = getTagProps({ index });
                            const { key, ...restProps } = tagProps;
                            return (
                              <Chip
                                key={key}
                                variant="outlined"
                                label={option}
                                {...restProps}
                                sx={{ margin: 0.5 }}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            fullWidth
                            size="medium"
                            placeholder="Select or add job skills..."
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              sx: {
                                "& textarea": {
                                  overflow: "hidden",
                                  resize: "none",
                                },
                              },
                            }}
                            error={Boolean(errors.skills)}
                            helperText={errors.skills?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {selectedSkills.map((skill) => (
                      <Chip
                        key={skill} // Ensure the key is unique
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={
                          <IconButton>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        }
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={2} md={2}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Currency
                  </Typography>

                  <Controller
                    name="currency"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        select
                        value={value}
                        onChange={onChange}
                        size="medium"
                        sx={{ overflow: "hidden" }}
                        error={Boolean(errors.currency)}
                        helperText={errors.currency?.message}
                      >
                        <MenuItem value="naira">₦</MenuItem>
                        <MenuItem value="pound">£</MenuItem>
                        <MenuItem value="dollar">$</MenuItem>
                        <MenuItem value="yen">¥</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Minimum
                  </Typography>

                  <Controller
                    name="minSalary"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="$1"
                        error={Boolean(errors.minSalary)}
                        helperText={errors.minSalary?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Maximum
                  </Typography>

                  <Controller
                    name="maxSalary"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="$999999"
                        error={Boolean(errors.maxSalary)}
                        helperText={errors.maxSalary?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Location
                  </Typography>

                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="South Gate, CA Allen FL"
                        error={Boolean(errors.location)}
                        helperText={errors.location?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Additional Information
                  </Typography>

                  <Controller
                    name="information"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={5}
                        value={value}
                        onChange={onChange}
                        size="medium"
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            "& textarea": {
                              overflow: "hidden",
                              resize: "none",
                            },
                          },
                        }}
                        placeholder="Any additional information..."
                        error={Boolean(errors.information)}
                        helperText={errors.information?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid> */}
            </Box>
          </DialogContent>

          {/* <DialogActions
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
              sx={{ textTransform: "capitalize", width: "30%" }}
              disabled={isSubmitting}
            >
              Post
            </Button>
          </DialogActions> */}
        </form>
      </Dialog>
    </div>
  );
};

export default AddEvent;
