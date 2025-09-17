export interface OpportunityData {
  id: string
  title: string
  companyName: string
  companyLogo: string
  jobType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Freelance"
  location: "Hybrid" | "Remote" | "Onsite"
  salaryRange: string
  currency: "USD" | "NGN"
  description: string
  postedDate: string
  daysLeft: number
  applicationsCount: number
  skills: string[]
  department: string
}

export const opportunityData: OpportunityData[] = [
  {
    id: "OPP001",
    title: "Backend Engineering",
    companyName: "Company Name",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Part Time",
    location: "Hybrid",
    salaryRange: "300.00 - 2000.00",
    currency: "USD",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type a...",
    postedDate: "02/07/2025",
    daysLeft: 0,
    applicationsCount: 1,
    skills: ["Node.js", "Python", "MongoDB", "AWS"],
    department: "Engineering",
  },
  {
    id: "OPP002",
    title: "Frontend Engineering",
    companyName: "Company Name",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Full Time",
    location: "Onsite",
    salaryRange: "200000.00 - 500000.00",
    currency: "NGN",
    description:
      "We are looking for a skilled Frontend Engineer to join our dynamic team. You will be responsible for building user-facing features and ensuring great user experience across our web applications.",
    postedDate: "02/07/2025",
    daysLeft: 2,
    applicationsCount: 0,
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    department: "Engineering",
  },
  {
    id: "OPP003",
    title: "UI/UX Designer",
    companyName: "Design Studio Pro",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Full Time",
    location: "Remote",
    salaryRange: "80000.00 - 120000.00",
    currency: "USD",
    description:
      "Join our creative team as a UI/UX Designer. You'll work on exciting projects, creating intuitive and beautiful user interfaces for web and mobile applications.",
    postedDate: "01/07/2025",
    daysLeft: 5,
    applicationsCount: 3,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    department: "Design",
  },
  {
    id: "OPP004",
    title: "Data Scientist",
    companyName: "Analytics Corp",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Full Time",
    location: "Hybrid",
    salaryRange: "150000.00 - 250000.00",
    currency: "USD",
    description:
      "We're seeking a Data Scientist to analyze complex datasets and provide actionable insights. You'll work with machine learning models and statistical analysis to drive business decisions.",
    postedDate: "30/06/2025",
    daysLeft: 7,
    applicationsCount: 5,
    skills: ["Python", "R", "SQL", "Machine Learning"],
    department: "Data",
  },
  {
    id: "OPP005",
    title: "Product Manager",
    companyName: "Innovation Labs",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Full Time",
    location: "Onsite",
    salaryRange: "120000.00 - 180000.00",
    currency: "USD",
    description:
      "Lead product development from conception to launch. Work closely with engineering, design, and marketing teams to deliver exceptional products that meet user needs.",
    postedDate: "29/06/2025",
    daysLeft: 10,
    applicationsCount: 2,
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    department: "Product",
  },
  {
    id: "OPP006",
    title: "DevOps Engineer",
    companyName: "Cloud Systems Inc",
    companyLogo: "/placeholder.svg?height=40&width=40",
    jobType: "Contract",
    location: "Remote",
    salaryRange: "100.00 - 150.00",
    currency: "USD",
    description:
      "Join our infrastructure team to build and maintain scalable cloud solutions. Experience with containerization and CI/CD pipelines is essential.",
    postedDate: "28/06/2025",
    daysLeft: 12,
    applicationsCount: 4,
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    department: "Engineering",
  },
]
