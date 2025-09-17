import { Delete, DeleteOutlineOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Typography } from "@mui/material";

const PictureSection = () => {

    return (
        <Box sx={{ width: 'fit-content' }}>
            <Box>
                <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>Picture</Typography>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>This is displaying on your profile</Typography>
            </Box>
            <Box sx={{ border: '1px dashed #D0D5DD', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px', padding: '20px' }}>
                <Box>
                <Avatar sx={{ width: '70px', height: '70px', mb: '10px' }}/>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center',gap: '10px' }}>
                    <DeleteOutlineOutlined />
                    <Box>
                    <Button variant="contained" sx={{ textTransform: 'none' }}>
                        Change
                    </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PictureSection;