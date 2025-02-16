import { IconButton } from '@mui/material';

const CustomIconButton = ({ onClick, icon, ...props }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        fontSize: {
          xs: '12px',  // Extra small screens (phones)
          sm: '12px',  // Small screens (tablets)
          md: '18px',  // Medium screens (desktops)
          lg: '18px',  // Large screens
          xl: '18px',  // Extra large screens
        },
        ...props.sx,  // Allow additional styles to be passed in
      }}
      {...props}
    >
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
