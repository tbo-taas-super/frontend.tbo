"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import { TalentTable } from "@/@core/component/talent/talent-table";
import { TalentProfile } from "@/@core/component/talent/talent-profile";
import { SearchBar } from "@/@core/component/common/search-bar";
import { CustomPagination } from "@/@core/component/common/custom-pagination";
import { StatsCard } from "@/@core/component/common/stats-card";
import { usePagination } from "@/@core/component/hooks/use-pagination";
import {
  getTalentPool,
  TalentPoolData,
  getTalentById,
  expressInterest,
} from "@/@core/services/clientTalent";
import {
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TalentDetailsData } from "@/@core/services/clientTalent";

// Define JobData interface
interface JobData {
  id: string;
  title: string;
  department: string;
}

// Define ExpressInterestData interface
interface ExpressInterestData {
  interested: boolean;
  interest_type: "new_job" | "general" | "existing_job";
  job_id?: number;
  job_title?: string;
  request_type?: "Direct Hire" | "Contract" | "Other";
  notes?: string;
}

// Define TalentData interface to match TalentTable expectations
interface TalentData {
  id: number;
  name: string;
  designation: string;
  location: string;
  status: string;
  years_experience: number | null;
  [key: string]: any;
}

// Extend TalentPoolData for API response
interface ExtendedTalentPoolData {
  talents: Array<{
    id: number;
    name: string | null | undefined;
    designation: string | null | undefined;
    location: string | null | undefined;
    status: string;
    years_experience?: number | undefined;
    [key: string]: any;
  }>;
  stats: {
    total_talent: string | number;
    active_talent: string | number;
    inactive_talent: string | number;
    avg_year_exp: string | number;
  } | null;
}

export default function TalentPool() {
  const [searchQuery, setSearchQuery] = useState("");
  const [talents, setTalents] = useState<TalentData[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<TalentDetailsData["talent"] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState<ExtendedTalentPoolData["stats"] | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch talent pool and jobs data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch talent pool
        const talentData = await getTalentPool() as ExtendedTalentPoolData;
        console.log("Fetched talents:", JSON.stringify(talentData.talents, null, 2));

        // Transform API data to match TalentData
        const transformedTalents: TalentData[] = talentData.talents.map(talent => ({
          ...talent,
          name: talent.name ?? "N/A",
          designation: talent.designation ?? "N/A",
          location: talent.location ?? "N/A",
          years_experience: talent.years_experience ?? null,
        }));

        setTalents(transformedTalents);
        setStats(talentData.stats || null);

        // Fetch jobs (replace with actual API call)
        const jobsData: JobData[] = await fetchJobs();
        setJobs(jobsData);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        console.log("Error object:", JSON.stringify(err, null, 2));
        toast.error(err?.response?.data?.message || err?.message || "Failed to fetch data", {
          toastId: "fetch-data-error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Placeholder function to fetch jobs
  const fetchJobs = async (): Promise<JobData[]> => {
    try {
      // Replace with actual API call
      return [
        { id: "1", title: "Frontend Developer", department: "Engineering" },
        { id: "2", title: "Backend Developer", department: "Engineering" },
      ];
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to fetch jobs", { toastId: "fetch-jobs-error" });
      return [];
    }
  };

  const filteredTalents = useMemo(
    () =>
      talents.filter(
        (talent) =>
          talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.location.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, talents]
  );

  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePrevious,
    handleNext,
  } = usePagination({
    data: filteredTalents,
    itemsPerPage: 10,
  });

  const handleViewProfile = async (talentId: number) => {
    if (typeof talentId !== "number" || isNaN(talentId)) {
      console.error("Invalid talentId:", talentId);
      toast.error("Invalid talent ID provided", {
        toastId: "invalid-talent-id",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await getTalentById(talentId);
      setSelectedTalent(data.talent); // Remove unnecessary transformation
      setDialogOpen(true);
    } catch (err: any) {
      console.error("Failed to fetch talent details:", err);
      console.log("Error object:", JSON.stringify(err, null, 2));
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch talent details", {
        toastId: "fetch-talent-details-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async (data: ExpressInterestData) => {
    if (!selectedTalent?.id || typeof selectedTalent.id !== "number") {
      console.error("Invalid talent ID:", selectedTalent?.id);
      toast.error("Invalid talent ID", {
        toastId: "invalid-talent-id-interest",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Expressing interest for talent ID:", selectedTalent.id, "with data:", data);
      const response = await expressInterest(selectedTalent.id, {
        interested: data.interested,
        interest_type: data.interest_type,
        job_id: data.job_id,
        job_title: data.job_title,
        request_type: data.request_type,
        notes: data.notes,
      });
      console.log("expressInterest response:", JSON.stringify(response, null, 2));
      toast.success(
        data.interest_type === "new_job"
          ? "Interest expressed for a new job!"
          : "Interest expressed for an existing job!",
        {
          toastId: `express-interest-success-${data.interest_type}`,
        }
      );
      setDialogOpen(false);
      setSelectedTalent(null);
      const updatedData = await getTalentPool() as ExtendedTalentPoolData;
      // Transform updated data
      const transformedTalents: TalentData[] = updatedData.talents.map(talent => ({
        ...talent,
        name: talent.name ?? "N/A",
        designation: talent.designation ?? "N/A",
        location: talent.location ?? "N/A",
        years_experience: talent.years_experience ?? null,
      }));
      setTalents(transformedTalents);
    } catch (err: any) {
      console.error("Failed to express interest:", err);
      console.log("Error object:", JSON.stringify(err, null, 2));
      toast.error(err?.response?.data?.message || err?.message || "Failed to express interest", {
        toastId: "express-interest-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotInterested = () => {
    setDialogOpen(false);
    setSelectedTalent(null);
  };

  // Calculate stats if not available from API (fallback)
  const displayStats = stats || {
    total_talent: talents.length.toString(),
    active_talent: talents.filter((t) => t.status === "active_talent").length.toString(),
    inactive_talent: talents.filter((t) => t.status === "inactive_talent").length.toString(),
    avg_year_exp: `${Math.round(
      talents.reduce((acc, t) => acc + (t.years_experience || 0), 0) / (talents.length || 1)
    )}y`,
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Talent Pool
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and connect with talented professionals
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {[
              {
                title: "Total Talents",
                value: displayStats.total_talent,
                icon: PeopleIcon,
                color: "#3B82F6",
                bgcolor: "#EFF6FF",
              },
              {
                title: "Active Talents",
                value: displayStats.active_talent,
                icon: FavoriteIcon,
                color: "#10B981",
                bgcolor: "#ECFDF5",
              },
              {
                title: "In Active Talents",
                value: displayStats.inactive_talent,
                icon: VisibilityIcon,
                color: "#F59E0B",
                bgcolor: "#FFFBEB",
              },
              {
                title: "Avg Experience",
                value: displayStats.avg_year_exp,
                icon: CalendarIcon,
                color: "#8B5CF6",
                bgcolor: "#F3E8FF",
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatsCard {...stat} value={String(stat.value)} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Talent List */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Search and Actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5">Available Talents</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTalents.length}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <SearchBar
                placeholder="Search talents..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
              {/* <Button variant="outlined" startIcon={<FilterIcon />} size="small">
                Filter
              </Button> */}
            
            </Box>
          </Box>

          {/* Table */}
          <TalentTable
            talents={paginatedData}
            onViewProfile={handleViewProfile}
          />

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTalents.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            itemName="talents"
          />
        </CardContent>
      </Card>

      {/* Talent Profile Dialog */}
      {selectedTalent && (
        <TalentProfile
          talent={selectedTalent}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onInterested={handleInterested}
          onNotInterested={handleNotInterested}
          jobs={jobs}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </Box>
  );
}