import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface InterviewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  interview: Interview | null;
}

interface Interview {
  image: string;
  name: string;
  role: string;
  interviewStage: 'Upcoming' | 'In Progress' | 'Completed';
  date: string;
  time: string;
  location: string;
}

const InterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({ open, onClose, interview }) => {
  if (!interview) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          width: {
            xs: '90%',
            sm: '500px',
            md: '600px',
            lg: '650px',
          },
        }}
      >
        {/* Header with Close Button */}
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              mb: '10px',
              mt: '10px',
            }}
          >
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography
                sx={{
                  color: '#0D0A0B',
                  fontSize: '24px',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Interview Details
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                position: 'absolute',
                right: 0,
                top: 4,
              }}
            >
              <Close onClick={onClose} sx={{ color: '#0D0A0B', cursor: 'pointer' }} />
            </Box>
          </Box>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
           
            <Typography variant="h6" fontWeight="bold">
              {interview.name}
            </Typography>
            {/* <Typography sx={{ color: '#666' }}>{interview.role}</Typography> */}
          </Box>

          <Box sx={{ mb: '20px', width: '100%', textAlign: 'center' }}>
            <Typography sx={{ color: '#0D0A0B', fontSize: '16px' }}>
              <strong>Date:</strong> {interview.date}
            </Typography>
            <Typography sx={{ color: '#0D0A0B', fontSize: '16px', mt: 1 }}>
              <strong>Time:</strong> {interview.time}
            </Typography>
            <Typography sx={{ color: '#0D0A0B', fontSize: '16px', mt: 1 }}>
              <strong>Location:</strong> {interview.location}
            </Typography>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            justifyContent: 'center',
            mb: '50px',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'none' },
          }}
        >
          {/* <Box>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                fontSize: '14px',
                py: '10px',
                px: { xs: '45px', sm: '40px' },
                ml: { xs: 1, sm: 0 },
                mr: { xs: 0, sm: 1 },
                mb: { xs: '20px', sm: '0px' },
                textTransform: 'none',
                fontWeight: 'bold',
                border: '2px solid',
                '&:hover': {
                  border: '2px solid',
                },
              }}
            >
              Reschedule
            </Button>
          </Box> */}
          <Box>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                fontSize: '14px',
                py: '10px',
                px: '40px',
                ml: { xs: 0, sm: 1 },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Attend
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default InterviewDetailsModal;
