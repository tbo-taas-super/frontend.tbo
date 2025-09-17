import MuiChip from "@mui/material/Chip";
import useBgColor from "../../../hooks/useBgColor";
import clsx from "clsx";

type ChipProps = {
  rounded?: boolean;
  skin?: "light" | "default";
  label?: string;
  size?: "small" | "medium";
  component?: any;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "default";
  sx?: object;
};

const CustomChip = (props: ChipProps) => {
  // ** Hook
  const bgColors = useBgColor();

  // ** Colors Object
  const colors = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  };

  // Prepare props to pass to MuiChip
  const { rounded, skin, color, sx, ...otherProps } = props;
  const propsToPass: Partial<ChipProps> = { ...otherProps }; // Clear out the rounded prop if not needed

  return (
    <MuiChip
      {...propsToPass}
      variant="filled"
      className={clsx({
        "MuiChip-rounded": rounded,
        "MuiChip-light": skin === "light",
      })}
      color={color} // Pass the color prop if it matches expected MUI values
      sx={
        skin === "light" && color && color !== "default"
          ? Object.assign(colors[color], sx)
          : sx
      }
    />
  );
};

export default CustomChip;
