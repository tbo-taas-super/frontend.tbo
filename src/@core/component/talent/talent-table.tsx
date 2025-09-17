"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";

export interface TalentData {
  id: number;
  name: string;
  designation: string;
  location: string;
  years_experience: number | null;
  status: string;
  avatar?: string;
  email?: string;
  phone?: string;
  professional_summary?: string;
  skills?: string[];
  education?: string;
  current_company?: string;
}

interface TalentTableProps {
  talents: TalentData[];
  onViewProfile: (id: number) => void;
}

export function TalentTable({ talents, onViewProfile }: TalentTableProps) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#F9FAFB" }}>
          <TableRow>
            <TableCell>Talent Name</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {talents.map((talent) => (
            <TableRow key={talent.id} hover>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {talent.name
                      ? talent.name.split(" ")[0].charAt(0).toUpperCase()
                      : "T"}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {talent.name ? talent.name.split(" ")[0] : "Unnamed Talent"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{talent.designation || "N/A"}</TableCell>
              <TableCell>
                <Chip
                  label={talent.status || "N/A"}
                  color={talent.status === "open_to_work" ? "success" : "default"}
                  size="small"
                  sx={{
                    bgcolor:
                      talent.status === "open_to_work" ? "#ECFDF5" : "#F3F4F6",
                    color:
                      talent.status === "open_to_work" ? "#065F46" : "#374151",
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => onViewProfile(Number(talent.id))}
                  disabled={!talent.id || isNaN(Number(talent.id))}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}