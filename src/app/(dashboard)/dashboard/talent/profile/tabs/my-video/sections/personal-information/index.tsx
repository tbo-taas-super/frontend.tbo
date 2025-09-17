import { Box, Grid, TextField, Typography } from "@mui/material";

const PersonalInformation = () => {

    const fieldsData = [
        {
            label: 'First Name',
            placeholder: 'Enter First Name'
        },
        {
            label: 'Surname',
            placeholder: 'Enter Surname'
        },
        {
            label: 'Email Address',
            placeholder: 'Enter Email Address'
        },
        {
            label: 'Phone Number',
            placeholder: 'Enter Phone Number'
        }
    ]

    return (
        <section>
            <Box>
                <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>Personal Information</Typography>
                <Typography sx={{ fontSize: '13px', mb: '10px' }}>Details about yourself</Typography>
                <Grid columnSpacing={4} rowSpacing={3} container>
                    {fieldsData.map((field, index) => (
                        <Grid key={index} item xs={12} sm={6} lg={6}>
                            <Box sx={{ color: '#101928', fontSize: '12px', fontWeight: 500, marginBottom: '5px' }}>{field.label}</Box>
                            <TextField placeholder={field.placeholder} sx={{ width: '100%' }} inputProps={{style: {fontSize: '12px'}}} ></TextField>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </section>
    );
}

export default PersonalInformation;