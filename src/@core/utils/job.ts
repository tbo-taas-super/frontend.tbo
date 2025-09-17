// types/job.ts
export interface Job {
  id: number;
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  about_the_role: string;
  skills: string[];
  currency: string;
  minimum_salary: string;
  maximum_salary: string;
  salary_type?: string;
  location: string;
  application_deadline: string;
  additional_info?: string;
  created_by: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  applicant_count: number;
  postingDate: string; // Added from JobListTable
  expirationDate: string; // Added from JobListTable
}