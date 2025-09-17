import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface PostJobModalProps {
  open: boolean;
  onClose: () => void;
  talentName?: string;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ open, onClose, talentName }) => {
  return (
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      mt: 6,
      borderRadius: 3,
      p: 3,
      height: '30vh',
      display: 'flex',
      flexDirection: 'column',
    },
  }}
  scroll="body"
>
 <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
  Post a Job to Contact {talentName?.split(" ")[0]} *****
</DialogTitle>

<DialogContent
  sx={{
    flex: 1,
    overflowY: 'auto',
  }}
>
  <Typography variant="body1" sx={{ mt: 1, fontSize: '1rem' }}>
    Please post a job first to connect with <strong>{talentName?.split(" ")[0]} *****</strong>. Once the job is posted, you’ll be able to view their full profile and start collaborating.
  </Typography>
</DialogContent>

<DialogActions sx={{ mt: 2 }}>
    <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={() => {
        window.location.href = "/dashboard/applications";
      }}
      sx={{ textTransform: "none" }}
    >
      Post a Job
    </Button>
  </DialogActions>
</Dialog>

  );
};

export default PostJobModal;
