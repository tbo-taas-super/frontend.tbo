export interface Job {
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
}

export interface Client {
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
  phone_number: string | null;
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

export interface AppliedJob {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  job: Job;
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
export interface JobsApiResponse {
  status: boolean;
  jobs: Job[];
}
export interface SavedJob {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  job: Job;
}

export interface AppliedJobsApiResponse {
  status: boolean;
  appliedJobs: AppliedJob[];
  applications: Application[];
}
