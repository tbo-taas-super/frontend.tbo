import React, { useState, useEffect } from "react";

// Icon Import
import Icon from "../../../@core/component/icon";

// MUI Imports
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip,
  Avatar, Badge, Tooltip, Rating, Divider, styled, alpha
} from "@mui/material";

// Components & Services
import PostJobModal from "../../../app/(default)/component/PostJobPopup";
import { getAllUser } from "@/@core/services/user";

// Types
type Talent = {
  id: number;
  name: string;
  skills: string[];
  hourlyRate: number;
  avatar: string;
  designation: string;
  rating: number;
  projectsCompleted: number;
  availability: string;
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

const TalentCard = ({ talent, onClick }: { talent: Talent; onClick: (id: number) => void }) => {
  const [hovered, setHovered] = useState(false);
  const isAvailableNow = talent.availability === "Available Now";

  return (
    <Card
      onClick={() => onClick(talent.id)}
      sx={{
        borderRadius: 3,
        height: "100%",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-8px)" : "none",
        boxShadow: hovered
          ? "0 12px 24px rgba(0,0,0,0.12)"
          : "0 4px 12px rgba(0,0,0,0.05)",
        cursor: "pointer",
        overflow: "visible",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: "relative", px: 3, mt: 1 }}>
        {isAvailableNow ? (
          // <StyledBadge
          //   overlap="circular"
          //   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          //   variant="dot"
          // >
            <Avatar
              src={talent.avatar}
              alt={talent.name}
              sx={{
                width: 72,
                height: 72,
                border: "3px solid #fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          // </StyledBadge>
        ) : (
          <Avatar
            src={talent.avatar}
            alt={talent.name}
            sx={{
              width: 72,
              height: 72,
              border: "3px solid #fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ pt: 2, px: 3, pb: 3 }}>
        <Box sx={{ mb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
           <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.5, fontSize: "1.1rem", lineHeight: 1.2 }}
          >
            {talent.name?.split(" ")[0]} *****
          </Typography>


            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
             <Chip
                label={talent.designation}
                size="small"
                sx={{
                  borderRadius: "6px",
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
              <Tooltip title={talent.availability}>
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    color: isAvailableNow ? "success.main" : "text.secondary",
                    fontWeight: isAvailableNow ? 600 : 400,
                  }}
                >
                  {isAvailableNow ? "Available now" : "Limited availability"}
                </Typography>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              {/* <Rating value={talent.rating} precision={0.1} readOnly size="small" sx={{ mr: 1 }} /> */}
              {/* <Typography variant="body2" color="text.secondary">
                {talent.rating} ({talent.projectsCompleted} projects)
              </Typography> */}
            </Box>
          </Box>

          {/* <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", color: "primary.main" }}>
            ${talent.hourlyRate}
            <Typography component="span" variant="caption" color="text.secondary">
              /hr
            </Typography>
          </Typography> */}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
          {talent.skills?.map((skill, index) => (
            <Chip key={index} label={skill} size="small" variant="outlined" sx={{ borderRadius: "6px", fontSize: "0.75rem" }} />
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          // endIcon={<Icon icon="material-symbols:arrow-forward-rounded" />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: hovered ? "0 6px 12px rgba(0,0,0,0.15)" : "0 3px 6px rgba(0,0,0,0.1)",
            py: 1.25,
          }}
        >
        Open to hire
        </Button>
      </CardContent>
    </Card>
  );
};

const TalentGrid = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  const fetchTalents = async () => {
    try {
      const users = await getAllUser();
      const filtered = users
        .filter((user: any) => user.account_type === "TALENT")
        .map((user: any) => ({
          id: user.id,
          name: `${user.name} `,
          skills: user.skills || [],
          hourlyRate: user.hourly_rate || 50,
          avatar: user.profile_image || "/placeholder.jpg",
          designation: user.designation || "General",
          rating: user.rating || 4.5,
          projectsCompleted: user.projects_completed || 0,
          availability: user.availability || "Available Now"
        }));
      setTalents(filtered);
    } catch (error) {
      console.error("Error fetching talents:", error);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleViewProfile = (talentId: number) => {
    const talent = talents.find((t) => t.id === talentId);
    setSelectedTalent(talent || null);
    setModalOpen(true);
  };

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 4 }, width: "100%", maxWidth: "1400px", mx: "auto", mb: 8 }}>
    <Box sx={{ mb: 12, textAlign: "center" }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1.75rem", sm: "2.25rem" },
          fontWeight: 700,
          mb: 2,
          mt: "20px",
        }}
      >
        Top Talent Showcase
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "1rem", md: "1.125rem" },
          maxWidth: "800px",
          mx: "auto",
          color: "text.secondary",
          mb: 4,
        }}
      >
        Find experts from various niches ready to work on your next project
      </Typography>
    </Box>
  
    <Grid container spacing={3}>
      {talents.map((talent) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={talent.id}>
          <TalentCard talent={talent} onClick={handleViewProfile} />
        </Grid>
      ))}
    </Grid>
  
    {talents.length === 0 && (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No talents found.
        </Typography>
      </Box>
    )}
  
    <PostJobModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      talentName={selectedTalent?.name}
    />
  </Box>
  
  );
};

export default TalentGrid;
