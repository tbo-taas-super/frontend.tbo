import { Close, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

const DocumentPreviewModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  return (
    <Dialog
      sx={{
        '.mui-1t1j96h-MuiPaper-root-MuiDialog-paper': {
          maxHeight: 'fit-content',
        },
      }}
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: { xs: 'auto', md: '700px' },
        }}
      >
        <DialogContent>
          <Stack gap={3}>
            <Stack
              sx={{ position: 'relative' }}
              direction='row'
              justifyContent='center'
              width='100%'
            >
              <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                Document Preview
              </Typography>
              <Close
                onClick={() => onClose()}
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              />
            </Stack>
            <Divider />
            <Stack
              display='flex'
              direction='row'
              alignItems='center'
              flexWrap='wrap'
              gap={2}
            >
              <Stack flexGrow={1}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                  Jane Doe Cover Letter
                </Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
                  PDF {'(49KB)'}
                </Typography>
              </Stack>
              <Stack
                gap={2}
                direction='row'
                alignItems='center'
                flexWrap='wrap'
              >
                {[
                  { icon: <Delete />, label: 'Delete' },
                  { icon: null, label: 'Replace' },
                  {
                    icon: null,
                    label: 'Export PDF',
                  },
                ].map((button, index) => (
                  <Button
                    key={index}
                    {...(index === 2
                      ? { variant: 'contained' }
                      : { variant: 'outlined' })}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      textTransform: 'none',
                    }}
                  >
                    {button.icon}
                    {button.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
            <Divider />
            <Stack alignItems='center'>
              <Box sx={{ width: { xs: 'auto', sm: '350px' } }}>
                <img
                  src='/document_preview_placeholder.svg'
                  alt='Document Preview Placeholder'
                  style={{ width: '100%' }}
                />
              </Box>
            </Stack>
            <Divider />
            <Stack alignItems='center'>
              <Button
                variant='contained'
                sx={{
                  textTransform: 'none',
                  width: { xs: '100%', sm: '300px' },
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default DocumentPreviewModal;
