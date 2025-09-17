// ** MUI Imports
import MuiAvatar from "@mui/material/Avatar";
import { lighten, useTheme } from "@mui/material/styles";

// ** Hooks Imports
import useBgColor from "@/@core/hooks/useBgColor";

interface AvatarProps {
  sx?: object;
  src?: string;
  skin: string;
  color?: string;
  children?: React.ReactNode;
}

const CustomAvatar: React.FC<AvatarProps> = (props) => {
  // ** Props
  const { sx, src, skin, color } = props;

  // ** Hook
  const theme = useTheme();
  const bgColors = useBgColor();

  const getAvatarStyles = (skin: string, skinColor: string) => {
    let avatarStyles;

    if (skin === "light") {
      avatarStyles = {
        ...bgColors[`${skinColor}Light` as keyof typeof bgColors],
      };
    } else if (skin === "light-static") {
      avatarStyles = {
        color: bgColors[`${skinColor}Light` as keyof typeof bgColors].color,
        backgroundColor: lighten((theme.palette as any)[skinColor].main, 0.88),
      };
    } else {
      avatarStyles = {
        ...bgColors[`${skinColor}Filled` as keyof typeof bgColors],
      };
    }

    return avatarStyles;
  };

  const colors: {
    [key: string]: {
      color: string;
      backgroundColor: string;
    };
  } = {
    primary: getAvatarStyles(skin, "primary"),
    secondary: getAvatarStyles(skin, "secondary"),
    success: getAvatarStyles(skin, "success"),
    error: getAvatarStyles(skin, "error"),
    warning: getAvatarStyles(skin, "warning"),
    info: getAvatarStyles(skin, "info"),
  };

  return (
    <MuiAvatar
      {...props}
      sx={!src && skin && color ? Object.assign(colors[color], sx) : sx}
    />
  );
};

CustomAvatar.defaultProps = {
  skin: "filled",
  color: "primary",
};

CustomAvatar.displayName = "CustomAvatar";
export default CustomAvatar;
