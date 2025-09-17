// * React Imports
import React, { useEffect, useState } from "react";

// ** Custom Component Imports
import StyledImage from "@/@core/component/mui/image";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

// * API
import { getAlljobs } from "@/@core/services/user";

interface Jobs {
  name: string;
  logo: string;
  type: string;
  title: string;
  location: string;
  minimum_salary: number;
  applicant_count: number;
  date: string;
}

interface JobCardProps {
  job: Jobs;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        background: (theme) =>
          `linear-gradient(to right, ${alpha(
            theme.palette.primary.light,
            0.7
          )}, ${alpha(theme.palette.primary.light, 0.3)}, ${alpha(
            theme.palette.primary.light,
            0.7
          )})`,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <StyledImage src={job.logo} alt={job.name} width={4} height={4} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "semibold" }}>{job.name}</Typography>
            <Typography
              sx={{
                color: (theme) => theme.palette.secondary.dark,
                textTransform: "capitalize",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Icon icon="carbon:location" fontSize="1rem" />
              {job.location}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            background: (theme) => theme.palette.secondary.light,
            p: 1,
            borderRadius: 1,
            color: (theme) => theme.palette.secondary.dark,
            textTransform: "uppercase",
          }}
        >
          <Typography
            sx={{
              fontWeight: "semibold",
              fontSize: "0.75rem",
              fontVariant: "all-small-caps",
            }}
          >
            {job.type}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography sx={{ fontWeight: "bold" }}>{job.title}</Typography>
        <Typography
          sx={{
            color: (theme) => theme.palette.secondary.dark,
            textTransform: "capitalize",
            fontSize: "0.8rem",
          }}
        >
          {`Salary: $${job.minimum_salary}`}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography
          sx={{
            color: (theme) => theme.palette.secondary.dark,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Icon icon="mdi:accounts" />
          {job.applicant_count} Applicants
        </Typography>
        <Typography
          sx={{
            color: (theme) => theme.palette.secondary.dark,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Icon icon="ph:clock-countdown-duotone" />
          {job.date}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button variant="text" size="small" sx={{ textTransform: "capitalize" }}>
          View
        </Button>
        <Link href="/dashboard/talent/job-vacancies" passHref>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
        >
          Apply
        </Button>
        </Link>
      </Box>
    </Paper>
  );
};

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAlljobs();
  
        // If the response is an object with a jobs array inside:
        setJobs(res?.jobs || []); // adjust based on actual response shape
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, []);
  

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Typography sx={{ fontWeight: "semibold", fontSize: "1.5rem", mb: 4 }}>
        Featured Jobs
      </Typography>

      {loading ? (
        <Typography>Loading jobs...</Typography>
      ) : (
        <Grid container spacing={4}>
          {jobs.slice(0, 6).map((job, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}

      <Paper
        sx={{
          mt: 4,
          p: 4,
          bgcolor: (theme) => theme.palette.primary.dark,
          color: "#fff",
          textAlign: { xs: "center", sm: "left" },
          display: "flex",
          justifyContent: "space-around",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.5rem" },
            textTransform: "capitalize",
          }}
        >
          Join and get access to vacancies that best suit your profile...
        </Typography>
        <Link href="/dashboard/talent/job-vacancies" passHref>
          <Button
            variant="contained"
            sx={{
              display: "flex",
              gap: 1,
              background: "#fff",
              color: (theme) => theme.palette.primary.dark,
              textTransform: "capitalize",
              "&:hover": {
                background: (theme) => theme.palette.primary.main,
                color: "#fff",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            Get Started
            <Icon icon="material-symbols-light:arrow-right-alt-rounded" />
          </Button>
        </Link>
      </Paper>
    </Box>
  );
};

export default FeaturedJobs;
