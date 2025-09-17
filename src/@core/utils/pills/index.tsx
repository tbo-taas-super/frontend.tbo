import { Typography } from '@mui/material';

export const TextOnlyPill: React.FC<{
  variant?: 'success' | 'warning' | 'error' | 'info' | 'grey';
  text?: string;
  bgColor?: string;
  dotColor?: string;
  textColor?: string;
}> = ({ variant, text, bgColor, dotColor, textColor }) => {
  return (
    <Typography
      sx={{
        borderRadius: '16px',
        ...(variant == undefined && {
          backgroundColor: bgColor,
          color: textColor,
        }),
        ...(variant == 'success' && {
          backgroundColor: '#E6F2E9',
          color: '#007A27',
        }),
        ...(variant == 'warning' && {
          backgroundColor: '#FEF9C3',
          color: '#713F12',
        }),
        ...(variant == 'error' && {
          backgroundColor: '#FFECF0',
          color: '#FF4364',
        }),
        ...(variant == 'grey' && {
          backgroundColor: '#E7E7E7',
          color: '#3D3B3C',
        }),
        paddingX: '12px',
        paddingY: '6px',
        fontSize: '12px',
        fontWeight: '500',
        alignItems: 'center',
        width: 'fit-content',
      }}
    >
      {text}
    </Typography>
  );
};
