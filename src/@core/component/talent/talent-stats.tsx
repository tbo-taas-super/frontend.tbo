import { Grid } from "@mui/material"
import { StatsCard } from "@/@core/component/common/stats-card"
import {
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"

interface TalentData {
  status: string
  experience: number
}

interface TalentStatsProps {
  talents: TalentData[]
}

export function TalentStats({ talents }: TalentStatsProps) {
  const stats = [
    {
      title: "Total Talents",
      value: talents.length.toString(),
      icon: PeopleIcon,
      color: "#3B82F6",
      bgcolor: "#EFF6FF",
    },
    {
      title: "Open to Work",
      value: talents.filter((t) => t.status === "Open to work").length.toString(),
      icon: FavoriteIcon,
      color: "#10B981",
      bgcolor: "#ECFDF5",
    },
    {
      title: "Passive",
      value: talents.filter((t) => t.status === "Passive").length.toString(),
      icon: VisibilityIcon,
      color: "#F59E0B",
      bgcolor: "#FFFBEB",
    },
    {
      title: "Avg Experience",
      value: `${Math.round(talents.reduce((acc, t) => acc + t.experience, 0) / talents.length)}y`,
      icon: CalendarIcon,
      color: "#8B5CF6",
      bgcolor: "#F3E8FF",
    },
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard {...stat} />
        </Grid>
      ))}
    </Grid>
  )
}
