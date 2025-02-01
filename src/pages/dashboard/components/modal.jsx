import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, useTheme } from '@mui/material';
import { tokens } from '../theme';

// Slide transition function
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
  open,
  onClose,
  title,
  children,
  styleProps,
  onConfirm,
  confirmMessage,
  noConfirm,
  transition = Transition, // Default transition is Slide
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { backgroundColor, color, padding, overflowY, ...customStyles } = styleProps || {};

  // Handle confirm button action
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={transition} // Apply transition (Slide by default)
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: backgroundColor || theme.palette.background.paper,
          color: color || theme.palette.text.primary,
          padding: padding || theme.spacing(2), // Ensure sufficient padding
          overflowY: overflowY || 'visible',
          borderRadius: '12px', // Add rounded borders
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.1)`, // Add box shadow
          ...customStyles,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.redAccent[500] }}>
          Cancel
        </Button>
        {!noConfirm && (
          <Button onClick={handleConfirm} sx={{ color: colors.greenAccent[500] }}>
            {confirmMessage || 'Confirm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
