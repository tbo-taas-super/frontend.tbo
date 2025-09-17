import { Box } from "@mui/material";
import SignUpInfo from "./components/SignUpInfo";
import SignUpForm from "./components/SignUpForm";

export default function SignUp() {

    return (
        <Box sx={{ display: "flex", minHeight: '100vh' }}>
            <SignUpInfo />
            <SignUpForm />
        </Box>
    );
}