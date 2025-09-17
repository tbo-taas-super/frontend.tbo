import { Box, Typography, Card, CardContent } from "@mui/material"
import type { SvgIconComponent } from "@mui/icons-material"

interface StatsCardProps {
  title: string
  value: string
  icon: SvgIconComponent
  color: string
  bgcolor: string
}

export function StatsCard({ title, value, icon: Icon, color, bgcolor }: StatsCardProps) {
  return (
    <Card sx={{ bgcolor, border: "none", height: "100%", width: "100%" }}>
      <CardContent sx={{ p: 3, height: "100%", width: "100%" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", width: "100%" }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              color,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
