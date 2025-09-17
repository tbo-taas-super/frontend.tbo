interface IFormInput {
  title: string;
  type: "FULL TIME" | "PART TIME" | "INTERNSHIP" | "FREELANCE";
  description: string;
  requirement: string;
  responsibilities: string; // New field
  benefits: string; // New field
  about_the_role: string; // New field
  skills: string[];
  location: "Hybrid" | "Remote" | "Onsite";
  currency: "USD" | "EUR" | "GBP" | "NGN";
  minSalary: number | null;
  maxSalary: number | null;
  salary_type: "MONTHLY" | "ANNUALLY";
  application_deadline: string;
  information: string | null;
}

export default IFormInput;