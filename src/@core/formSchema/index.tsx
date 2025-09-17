import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";

export const search = yup.object().shape({
  name: yup.string(),
});

export const jobSearchSchema = yup.object().shape({
  role: yup.string().optional(),
  location: yup.string().optional(),
});

export const supportSchema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  phone: yup.string().required("Please enter your phone number"),
  subject: yup.string().required("Please enter your subject"),
  message: yup.string().required("Please enter your message"),
});

export const companySchema = yup.object().shape({
  company_name: yup.string().required("Please enter your company name"),
  company_email_address: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  number_of_employees: yup.string().required("Please enter your number of employees"), // Changed to string to match "50-100" format
  type_of_employer: yup.string().required("Please enter your type of employer"), // Note: "employer" is misspelled as "employer" in backend
  company_address: yup.string().required("Please enter your company address"),
  country: yup.string().required("Please enter your country"),
  company_phone_number: yup.string().required("Please enter your company phone number"),
  industry: yup.string().required("Please enter your industry"),
  company_website: yup.string().required("Please enter your website"),
  contact_person: yup.string().required("Please enter Representative name"), // Note: "person" is misspelled as "persion" in backend
  work_email: yup
    .string()
    .email("Please enter a valid email")
    .required("Work email address required"),
  position_in_company: yup.string().required("Please enter representative position"),
  company_logo: yup.string().required("Please Add Company Logo "),
  // company_logo is not included in the form as it appears to be auto-generated
});

export const passwordSchema = yup.object().shape({
  password: yup.string().required("Please enter your current password"),
  newPassword: yup
    .string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export const newJobSchema = yup.object().shape({
  title: yup.string().max(255).required(),
  type: yup
    .mixed<"FULL TIME" | "PART TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE">()
    .oneOf(["FULL TIME", "PART TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
    .required(),
  description: yup.string().required(),
  requirement: yup.string().required(),
  responsibilities: yup.string().required("Responsibilities are required"), // New field
  benefits: yup.string().required("Benefits are required"), // New field
  about_the_role: yup.string().required("About the role is required"), // New field
  skills: yup
    .array()
    .of(yup.string().max(255).required())
    .min(5)
    .max(10)
    .required(),
  location: yup
    .string()
    .oneOf(["Hybrid", "Remote", "Onsite"], "Please select a valid location")
    .required("Location is required"),
  currency: yup
    .mixed<"USD" | "EUR" | "GBP" | "NGN">()
    .oneOf(["USD", "EUR", "GBP", "NGN"])
    .required(),
  minSalary: yup.number().min(0).defined(),
  maxSalary: yup
    .number()
    .min(0)
    .defined()
    .test("max-greater-than-min", "Maximum salary must be greater than minimum salary", function (value) {
      const { minSalary } = this.parent;
      if (value != null && minSalary != null) {
        return value > minSalary;
      }
      return true;
    }),
  salary_type: yup
    .mixed<"MONTHLY" | "ANNUALLY">()
    .oneOf(["MONTHLY", "ANNUALLY"])
    .required(),
  application_deadline: yup
    .string()
    .required()
    .test("is-future-date", "Deadline must be in the future", (value) =>
      value ? dayjs(value).isAfter(dayjs(), "day") : false
    ),
  information: yup.string().nullable().defined(),
  client_id: yup.string().required(),
});

export const newJobSchema2 = yup.object().shape({
  title: yup.string().max(255, "Title must be at most 255 characters").required(),
  type: yup
    .mixed<"FULL TIME" | "PART TIME" | "INTERNSHIP" | "FREELANCE">()
    .oneOf(["FULL TIME", "PART TIME", "INTERNSHIP", "FREELANCE"])
    .required(),
  description: yup.string().required(),
  requirement: yup.string().required(),
  responsibilities: yup.string().required("Responsibilities are required"), // New field
  benefits: yup.string().required("Benefits are required"), // New field
  about_the_role: yup.string().required("About the role is required"), // New field
  skills: yup
    .array()
    .of(yup.string().max(255).required())
    .min(5)
    .max(10)
    .required(),
  location: yup
    .string()
    .oneOf(["Hybrid", "Remote", "Onsite"], "Please select a valid location")
    .required("Location is required"),
  currency: yup.mixed<"USD" | "EUR" | "GBP" | "NGN">().oneOf(["USD", "EUR", "GBP", "NGN"]).required(),
  minSalary: yup.number().min(0).defined(),
  maxSalary: yup
    .number()
    .min(0)
    .defined()
    .test("max-greater-than-min", "Maximum salary must be greater than minimum salary", function (value) {
      const { minSalary } = this.parent;
      if (value != null && minSalary != null) {
        return value > minSalary;
      }
      return true;
    }),
  salary_type: yup.mixed<"MONTHLY" | "ANNUALLY">().oneOf(["MONTHLY", "ANNUALLY"]).required(),
  application_deadline: yup
    .string()
    .required()
    .test("is-future-date", "Deadline must be in the future", (value) =>
      value ? dayjs(value).isAfter(dayjs(), "day") : false
    ),
  information: yup.string().nullable().defined(),
});

export const newJobSchemaClone = yup.object().shape({
  title: yup.string().required("Job title is required"),
  type: yup.string().required("Job type is required"),
  description: yup.string().required("Job description is required"),
  requirement: yup.string().required("Job requirement is required"),
  responsibilities: yup.string().required("Responsibilities are required"), // New field
  benefits: yup.string().required("Benefits are required"), // New field
  about_the_role: yup.string().required("About the role is required"), // New field
  skills: yup.array().required("Please add at least one skill"),
  location: yup.string().required("Job location is required"),
  currency: yup.string().required("Job currency is required"),
  minSalary: yup.string().required("Minimum salary is required"),
  maxSalary: yup.string().required("Maximum salary is required"),
  information: yup.string().required("Job information is required"),
});

export const interviewSchema = yup.object().shape({
  applicationId: yup.number().min(1, "Please select an application").required("Application is required"),
  userId: yup.number().min(1, "User ID is required").required("User ID is required"),
  interviewerName: yup.string().required("Interviewer name is required"),
  interviewerDepartment: yup.string().required("Department is required"),
  interviewerEmail: yup.string().email("Invalid email format").required("Email is required"),
  interviewerPhone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("Phone number is required"),
  interviewDate: yup.string().required("Interview date is required"),
  interviewTime: yup.string().required("Interview time is required"),
  duration: yup.string().required("Duration is required"),
  format: yup.string().required("Interview format is required"),
  information: yup.string().optional(),
  reminder: yup.string().optional(),
  tboRepName: yup.string().required("TBO representative name is required"),
  tboRepEmail: yup.string().email("Invalid email format").required("TBO email is required"),
  tboRepPhone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("TBO phone number is required"),
});

export const newAdminSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required")
    .max(255, "Full Name must be at most 255 characters"),
  account_type: yup
    .mixed<"ADMIN" | "SUPER_ADMIN" | "TECH">()
    .oneOf(["ADMIN", "SUPER_ADMIN", "TECH"], "Invalid role")
    .required("Role is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email")
    .max(255, "Email must be at most 255 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  password_confirmation: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const AdminProfileSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().required("Email is required"),
  role: yup.string().required("Role is required"),
  adminPrivileges: yup.string().required("adminPrivileges is required"),
});