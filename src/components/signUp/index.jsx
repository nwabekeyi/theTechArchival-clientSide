import { Box, Button, TextField, Typography, Alert, MenuItem, FormControl, InputLabel, Select, CircularProgress, Modal, Backdrop, Fade } from '@mui/material';
import useSignUp from './useSignUp';

const SignUpForm = ({ role, offline, selectedUser }) => {
    const {
        roleFields,
        error,
        loadingCohorts,
        handleProgramChange,
        handleCohortChange,
        handleChange,
        handleSubmit,
        formData,
        formRef,
        assignedInstructor,
        modalOpen,
        modalMessage,
        setModalOpen
    } = useSignUp({ offline, role, selectedUser });

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box>
            <Typography variant="h4">
                Sign Up ({role.charAt(0).toUpperCase() + role.slice(1)})
            </Typography>
            <form onSubmit={handleSubmit} ref={formRef}>
                {roleFields[role].map((field) => (
                    <Box key={field.name} mb={2}>
                        {field.name === 'assignedInstructor' ? (
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={assignedInstructor}
                                disabled
                                fullWidth
                            />
                        ) : field.name === 'cohort' ? (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleCohortChange}
                                    required={field.required}
                                >
                                    {loadingCohorts ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={24} />
                                        </MenuItem>
                                    ) : (
                                        field.options && field.options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        ) : field.type === 'select' ? (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleProgramChange}
                                    required={field.required}
                                >
                                    {field.options && field.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : field.type === 'file' ? (
                            <Box mb={2}>
                                <input
                                    type="file"
                                    name={field.name}
                                    id={field.name}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={{ display: 'block', width: '100%' }}
                                />
                            </Box>
                        ) : (
                            <TextField
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                fullWidth
                            />
                        )}
                    </Box>
                ))}
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" type="submit">
                    {selectedUser ? 'Update' : 'Sign Up'}
                </Button>
            </form>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', padding: 4 }}>
                        <Typography variant="h6" component="h2">
                            {modalMessage}
                        </Typography>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default SignUpForm;
