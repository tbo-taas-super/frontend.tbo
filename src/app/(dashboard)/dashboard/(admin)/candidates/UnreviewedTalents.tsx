import React, { useEffect, useState } from "react";
import Icon from "@/@core/component/icon";
import { getTalents } from "@/@core/services/adminService";
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import CustomChip from "@/@core/component/mui/chip";
import DocumentUpload from "./components/document-upload";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar, Menu } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Link from "@mui/material/Link";

// Talent data interface
interface TalentData {
  id: number;
  name: string;
  email: string;
  account_type: string;
  phone_number?: string | null;
  cv_upload?: string | null;
  cover_letter_upload?: string | null;
  id_upload?: string | null;
  video_url?: string | null;
  project_screenshots?: string[] | null;
  work_sample_upload?: string | null;
  portfolio_link?: string | null;
  profile_image?: string | null;
  designation?: string | null;
  location?: string | null;
  years_experience?: number | null;
  availability_status?: "open_to_work" | "passive" | null;
  professional_summary?: string | null;
  skills?: string[] | null;
  current_company?: string | null;
  education?: string | null;
  email_verified_at?: string | null;
  otp?: string | null;
  otp_expires_at?: string | null;
  is_verified?: number;
  isPasswordChange?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  status?: string;
  reset_token?: string | null;
}

// FileData interface for DocumentUpload
interface FileData {
  url: string;
  name: string;
  type: string;
}

const AllTalents = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [talents, setTalents] = useState<TalentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  // Fetch talents on component mount
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const data = await getTalents();
        setTalents(data);
        setAnchorEl(Array(data.length).fill(null));
      } catch (err) {
        setError("Failed to load talents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  const handleOpenViewDialog = (talent: TalentData) => {
    setSelectedTalent(talent);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setSelectedTalent(null);
    setViewDialogOpen(false);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowOptionsClick = (event: any, index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handleRowOptionsClose = (index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;
    setAnchorEl(newAnchorEl);
  };

  const toggleFilter = () => setOpenFilter(!openFilter);

  // Parse education JSON string
  const parseEducation = (
    education: string | null
  ): Array<{ institution?: string; degree?: string; year?: string }> => {
    if (!education) return [];
    try {
      return JSON.parse(education);
    } catch (e) {
      console.error("Error parsing education JSON:", e);
      return [];
    }
  };

  // Extract file info for DocumentUpload
  const extractFileInfo = (url: string | null, defaultName: string, defaultType: string): FileData | null => {
    if (!url) return null;

    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    let fileName = lastPart || defaultName;
    let fileType = defaultType;

    if (fileName.includes(".")) {
      const extension = fileName.split(".").pop()?.toLowerCase();
      if (extension === "pdf") {
        fileType = "application/pdf";
      } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
        fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      }
    } else {
      fileName = defaultName;
    }

    return { url, name: fileName, type: fileType };
  };

  // Pagination logic
  const paginatedTalents = talents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card
      sx={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        my: (theme) => theme.spacing(4),
        background: "#fff",
      }}
    >
      <CardContent sx={{ p: (theme) => theme.spacing(3) }}>
        {!smallScreen && (
          <Typography variant="h6">All Talents</Typography>
        )}

        <Collapse
          easing={"ease-in-out"}
          in={openFilter}
          timeout={500}
          unmountOnExit
          sx={{ mb: 3, boxShadow: 4 }}
        >
          <Paper sx={{ px: 3, py: 3 }}>
            <Typography
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Filter
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  fullWidth
                  label="Availability Status"
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="open_to_work">Open to Work</MenuItem>
                  <MenuItem value="passive">Passive</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  fullWidth
                  label="Years of Experience"
                >
                  <MenuItem value="">Select Years</MenuItem>
                  <MenuItem value="1">Less than 1</MenuItem>
                  <MenuItem value="3">1-3 Years</MenuItem>
                  <MenuItem value="5">3-5 Years</MenuItem>
                  <MenuItem value="6">More than 5</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        <Box
          sx={{
            my: 3,
            mx: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-end", md: "space-between" },
          }}
        >
          {smallScreen && <Typography variant="h6">All Talents</Typography>}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CustomTextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              placeholder="Search by name, email, or designation"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    <Icon icon="lets-icons:search-duotone" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={toggleFilter}
              variant={openFilter ? "contained" : "outlined"}
              size="medium"
              sx={{
                textTransform: "capitalize",
                width: "fit-content",
                minWidth: { md: 80 },
              }}
            >
              {smallScreen && (
                <Typography sx={{ fontSize: ".857rem" }}>Filter</Typography>
              )}
              <Icon icon="basil:filter-outline" />
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ background: (theme) => theme.palette.secondary.dark }}>
                <TableCellStyled align="left" sx={{ minWidth: 50 }}>
                  <Checkbox size="small" />
                </TableCellStyled>
                <TableCellStyled align="left">Serial Number</TableCellStyled>
                <TableCellStyled align="left" sx={{ minWidth: 150 }}>
                  Name
                </TableCellStyled>
                <TableCellStyled align="left">Email</TableCellStyled>
                <TableCellStyled align="left">Designation</TableCellStyled>
                <TableCellStyled align="left">Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTalents
                .filter((talent) =>
                  value
                    ? talent.name.toLowerCase().includes(value.toLowerCase()) ||
                      talent.email.toLowerCase().includes(value.toLowerCase()) ||
                      (talent.designation &&
                        talent.designation.toLowerCase().includes(value.toLowerCase()))
                    : true
                )
                .filter((talent) =>
                  status
                    ? talent.availability_status === status ||
                      (status === "1" && (talent.years_experience || 0) < 1) ||
                      (status === "3" && (talent.years_experience || 0) >= 1 && (talent.years_experience || 0) <= 3) ||
                      (status === "5" && (talent.years_experience || 0) > 3 && (talent.years_experience || 0) <= 5) ||
                      (status === "6" && (talent.years_experience || 0) > 5)
                    : true
                )
                .map((talent, i) => (
                  <TableRow key={talent.id}>
                    <TableCell align="left">
                      <Checkbox size="small" />
                    </TableCell>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>{talent.name}</TableCell>
                    <TableCell>{talent.email}</TableCell>
                    <TableCell>{talent.designation || "N/A"}</TableCell>
                    <TableCell>
                      <Box sx={{ alignSelf: "end" }}>
                        <Avatar sx={{ background: "transparent" }}>
                          <IconButton
                            size="small"
                            onClick={(event) => handleRowOptionsClick(event, i)}
                          >
                            <Icon icon="tabler:dots-vertical" />
                          </IconButton>
                          <Menu
                            keepMounted
                            disableScrollLock
                            anchorEl={anchorEl[i]}
                            open={Boolean(anchorEl[i])}
                            onClose={() => handleRowOptionsClose(i)}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{ style: { minWidth: "8rem" } }}
                          >
                            <MenuItem
                              sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                              onClick={() => {
                                handleRowOptionsClose(i);
                                handleOpenViewDialog(talent);
                              }}
                            >
                              <Icon icon="tabler:eye" fontSize={20} />
                              View
                            </MenuItem>
                          </Menu>
                        </Avatar>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <TablePagination
        component="div"
        count={talents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Talent Details</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTalent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Talent Information */}
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Talent Information
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedTalent.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Email:</strong> {selectedTalent.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Phone:</strong> {selectedTalent.phone_number || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Designation:</strong> {selectedTalent.designation || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Location:</strong> {selectedTalent.location || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Years of Experience:</strong> {selectedTalent.years_experience || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Status:</strong> {selectedTalent.status || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Created At:</strong> {new Date(selectedTalent.created_at || "").toLocaleDateString() || "N/A"}</Typography>
                </Grid>
              </Grid>

              {/* Documents & Links */}
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Documents & Links
              </Typography>
              <Grid container spacing={2} mb={2}>
                {/* CV */}
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>CV:</strong></Typography>
                 {extractFileInfo(selectedTalent.cv_upload ?? null, "CV-Resume.pdf", "application/pdf") ? (
                    <DocumentUpload
                      label="CV/Resume"
                      accept="application/pdf,.doc,.docx"
                      fileData={extractFileInfo(selectedTalent.cv_upload ?? null, "CV-Resume.pdf", "application/pdf")}
                      onChange={() => {}} // No-op for read-only
                      onRemove={() => {}} // No-op for read-only
                      description="View CV (PDF, DOC, DOCX)"
                    />
                  ) : (
                    <Typography>Not Provided</Typography>
                  )}
                </Grid>

                {/* Cover Letter */}
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Cover Letter:</strong></Typography>
                  {extractFileInfo(selectedTalent.cover_letter_upload ?? null, "Cover-Letter.pdf", "application/pdf") ? (
                    <DocumentUpload
                      label="Cover Letter"
                      accept="application/pdf,.doc,.docx"
                      fileData={extractFileInfo(selectedTalent.cover_letter_upload ?? null, "Cover-Letter.pdf", "application/pdf")}
                      onChange={() => {}} // No-op for read-only
                      onRemove={() => {}} // No-op for read-only
                      description="View Cover Letter (PDF, DOC, DOCX)"
                    />
                  ) : (
                    <Typography>Not Provided</Typography>
                  )}
                </Grid>

                {/* ID Upload */}
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>ID Upload:</strong></Typography>
                  {extractFileInfo(selectedTalent.id_upload ?? null, "ID-Document.png", "image/png") ? (
                    <DocumentUpload
                      label="ID Document"
                      accept="image/*,application/pdf"
                      fileData={extractFileInfo(selectedTalent.id_upload ?? null, "ID-Document.png", "image/png")}
                      onChange={() => {}} // No-op for read-only
                      onRemove={() => {}} // No-op for read-only
                      description="View ID Document (Image, PDF)"
                    />
                  ) : (
                    <Typography>Not Provided</Typography>
                  )}
                </Grid>

                {/* Work Sample */}
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Work Sample:</strong></Typography>
                  {extractFileInfo(selectedTalent.work_sample_upload ?? null, "Work-Sample.pdf", "application/pdf") ? (
                    <DocumentUpload
                      label="Work Sample"
                      accept="application/pdf,.doc,.docx"
                      fileData={extractFileInfo(selectedTalent.work_sample_upload ?? null, "Work-Sample.pdf", "application/pdf")}
                      onChange={() => {}} // No-op for read-only
                      onRemove={() => {}} // No-op for read-only
                      description="View Work Sample (PDF, DOC, DOCX)"
                    />
                  ) : (
                    <Typography>Not Provided</Typography>
                  )}
                </Grid>

                {/* Video URL */}
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Video:</strong>{" "}
                    {selectedTalent.video_url ? (
                      <Link href={selectedTalent.video_url} target="_blank" rel="noopener">
                        View Video
                      </Link>
                    ) : (
                      "Not Provided"
                    )}
                  </Typography>
                </Grid>

                {/* Portfolio Link */}
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Portfolio:</strong>{" "}
                    {selectedTalent.portfolio_link ? (
                      <Link href={selectedTalent.portfolio_link} target="_blank" rel="noopener">
                        View Portfolio
                      </Link>
                    ) : (
                      "Not Provided"
                    )}
                  </Typography>
                </Grid>

                {/* Profile Image */}
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Profile Image:</strong>{" "}
                    {selectedTalent.profile_image ? (
                      <img
                        src={selectedTalent.profile_image}
                        alt="Profile"
                        style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    ) : (
                      "Not Provided"
                    )}
                  </Typography>
                </Grid>

                {/* Project Screenshots */}
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Project Screenshots:</strong>
                    {selectedTalent.project_screenshots && selectedTalent.project_screenshots.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {selectedTalent.project_screenshots.map((screenshot, index) => (
                          <Link key={index} href={screenshot} target="_blank" rel="noopener">
                            <img
                              src={screenshot}
                              alt={`Screenshot ${index + 1}`}
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                          </Link>
                        ))}
                      </Box>
                    ) : (
                      " Not Provided"
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Skills */}
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Skills
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    {selectedTalent.skills?.length ? selectedTalent.skills.join(", ") : "None"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Professional Summary */}
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Professional Summary
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTalent.professional_summary || "Not Provided"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Education */}
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Education
              </Typography>
              <Grid container spacing={2}>
             {parseEducation(selectedTalent.education ?? null).length ? (
              parseEducation(selectedTalent.education ?? null).map((edu, index) => (
                <Grid item xs={12} key={index}>
                  <Typography variant="body2">
                    <strong>{edu.degree || "N/A"}</strong> at {edu.institution || "N/A"} ({edu.year || "N/A"})
                  </Typography>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2">Not Provided</Typography>
              </Grid>
            )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AllTalents;