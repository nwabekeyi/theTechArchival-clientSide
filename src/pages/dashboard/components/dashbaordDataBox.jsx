import { Box, useTheme } from "@mui/material";
import { tokens } from '../theme';

const DashboardDataBox = ({ children, gridColumn, big, ...rest }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      gridColumn={gridColumn}
      backgroundColor={colors.primary[400]}
      p="20px"
      borderRadius={big ? '10px' : '8px'}
      sx={{
        // Conditionally apply box shadow based on theme mode
        boxShadow: theme.palette.mode === 'light'
          ? '0px 2px 10px rgba(0, 0, 0, 0.2)' // Lighter shadow for light mode
          : '0px 4px 12px rgba(0, 0, 0, 0.3)', // Darker shadow for dark mode
      }}
      {...rest} // Spread additional props here
    >
      {children} {/* Rendering children inside the Box */}
    </Box>
  );
};

export default DashboardDataBox;
