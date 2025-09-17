import { API_BASE_URL } from "@/@core/utils/constants";
import { getSession } from "next-auth/react";

export const fetchJobs = async () => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await response.json();
  return data;
};

export const fetchApplications = async () => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data = await response.json();
  return data;
};

export const fetchApplicationById = async (id: string) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/applications/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch application details");
  }

  const data = await response.json();
  return data;
};
export const fetchClientApplications = async () => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch client applications");
  }

  const data = await response.json();
  return data;
};

export const fetchJobsClients = async () => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await response.json();
  return {
    status: data.status,
    jobs: data.jobs.map((job: any) => ({
      ...job,
      skills: JSON.parse(job.skill || "[]"),
    })),
    total: data.total || data.jobs.length,
  };
};

export const fetchJobsClientsById = async (jobId: string) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job");
  }

  const data = await response.json();
  return {
    status: data.status,
    job: {
      ...data.job,
      skills: JSON.parse(data.job.skill || "[]"),
    },
  };
};

export const fetchJobsclinetsById = async (id: string) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/jobs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job details");
  }

  const data = await response.json();
  return data;
};

export const deleteJobById = async (jobId: number) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete job");
  }

  return response.json();
};

export const deactivateJobById = async (jobId: number): Promise<any> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/client/jobs/${jobId}/deactivate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate job");
  }

  const data = await response.json();
  return data;
};

export const fetchJobsById = async (id: string) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/jobs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job details");
  }

  const data = await response.json();
  return data;
};

export const createJob = async (jobDetails: {
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  about_the_role: string;
  skills: string[];
  currency: string;
  minimum_salary: number | null;
  maximum_salary: number | null;
  salary_type: string;
  location: string;
  application_deadline: string;
  additional_info?: string | null;
  client_id: number;
}) => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await fetch(`${API_BASE_URL}/admin/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobDetails),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error creating job: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      throw new Error("Failed to parse JSON response.");
    }
  } catch (error: any) {
    console.error("Error creating job:", error.message);
    throw new Error(error.message || "Something went wrong while creating the job");
  }
};

export const createJobclient = async (jobDetails: {
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  about_the_role: string;
  skills: string[];
  currency: string;
  minimum_salary: number;
  maximum_salary: number;
  location: string;
  salary_type: string;
  application_deadline: string;
  additional_info?: string;
}) => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await fetch(`${API_BASE_URL}/client/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobDetails),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error creating job: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      throw new Error("Failed to parse JSON response.");
    }
  } catch (error: any) {
    console.error("Error creating job:", error.message);
    throw new Error(error.message || "Something went wrong while creating the job");
  }
};

export const editJobClient = async (
  jobId: number,
  jobDetails: {
    title: string;
    job_type: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    about_the_role: string;
    skills: string[];
    currency: string;
    minimum_salary: number;
    maximum_salary: number;
    location: string;
    salary_type: string;
    application_deadline: string;
    additional_info?: string;
  }
) => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const payload: typeof jobDetails & { skill: string; skills?: string[] } = {
      ...jobDetails,
      skill: JSON.stringify(jobDetails.skills),
    };

    const response = await fetch(`${API_BASE_URL}/client/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error updating job: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return {
        ...data,
        job: {
          ...data.job,
          skills: JSON.parse(data.job.skill || "[]"),
        },
      };
    } catch (error) {
      throw new Error("Failed to parse JSON response.");
    }
  } catch (error: any) {
    console.error("Error updating job:", error.message);
    throw new Error(error.message || "Something went wrong while updating the job");
  }
};

export const activateJob = async (jobId: number) => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}/activate`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to activate job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error activating job:", error);
    throw error;
  }
};

export const deactivateJob = async (jobId: number): Promise<any> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}/deactivate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate job");
  }

  const data = await response.json();
  return data;
};

export const rejectJob = async (jobId: number): Promise<any> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to reject job");
  }

  return await response.json();
};

export const deleteJob = async (jobId: number) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete job");
  }

  return response.json();
};

export const updateApplicationStatus = async (applicationId: number, status: string) => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to update application status: ${responseText}`);
  }

  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON response.");
  }
};