import { Box } from "@mui/material";
import Image from "next/image";

const OAuth: React.FC<{ index: number, option: {icon: string, name: string} }> = ({index, option}) => {

    return (
        <Box key={index} sx={{ display: "flex", border: '1.5px solid #D0D5DD', borderRadius: '6px', padding: '6px 30px',  alignItems: 'center', ...(index===0 ? {marginRight: '5px'} : {marginLeft: '5px'}), cursor: "pointer", "&:hover": {border: '1.5px solid #E61C31'} }}>
                            <Image style={{ marginRight: '8px' }} src={option.icon} width={14.3} height={14.3} alt={`${option.name} Icon`}/>
                            <Box sx={{ fontSize: '11.4px', fontWeight: 600 }}>{option.name}</Box>
                        </Box>
    );
}

export default OAuth;