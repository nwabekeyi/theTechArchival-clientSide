import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography, Tabs, Tab } from "@mui/material";
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpInstructor, SignUpAdmin } from '../../../signUp';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from "../../../../components/table";
import useUserManagement from './useUserManagement';
import ScrollDialog from '../../components/scrollDialog'; // Importing the ScrollDialog component
import SignUpForm from '../../../../components/signUp';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    instructors,
    studentData,
    instructorData,
    selectedRole,
    setSelectedRole,
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    selectedUser,
    setSelectedUser,
    confirmDialogOpen,
    setConfirmDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    signUpDialogOpen,
    setSignUpDialogOpen,
    handleRoleSelect,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowClick,
    handleEdit,
    handleProgramChange,
    handleDelete,
    columns,
    tabIndex,
    handleTabChange,
    viewUserDetails,
    setViewUserDetails
  } = useUserManagement();

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const openEditDialog = () => setEditDialogOpen(true);
  const openSignUpDialog = () => setSignUpDialogOpen(true);

  // Ensure the dialogs open when the selectedUser is set
  useEffect(() => {
    if (selectedUser) {
      setViewUserDetails(true); // If there's a selected user, open the dialog.
    }
  }, [selectedUser]);

  return (
    <Box>
      <Header title="User Management" subtitle="Manage users" />

      <Dropdown
        label="Add Users"
        options={[
          { value: "student", label: "Student" },
          { value: "instructor", label: "Instructor" },
          { value: "admin", label: "Admin" },
        ]}
        onSelect={handleRoleSelect}
      />

      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Students" />
          <Tab label="Instructors" />
          <Tab label="Offline Students" />
        </Tabs>
      </Box>

      {/* Tab Content for Students */}
      {tabIndex === 0 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={studentData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('student')}
          />
        </Box>
      )}

      {/* Tab Content for Instructors */}
      {tabIndex === 1 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={instructorData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('instructor')}
          />
        </Box>
      )}

      {/* Tab Content for Offline Students */}
      {tabIndex === 2 && (
        <TableComponent
          columns={columns}
          tableHeader="User Management"
          data={formattedOfflineStudents}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      {/* User Details View */}
      {selectedUser && (
        <ScrollDialog
          buttonLabel="View User Details"
          dialogTitle="User Details"
          dialogContent={
            <>
              <Typography>User ID: {selectedUser.userId}</Typography>
              <Typography>Name: {`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Phone Number: {selectedUser.phoneNumber}</Typography>
              <Typography>Role: {selectedUser.role}</Typography>
              <Typography>Program: {selectedUser.program}</Typography>
              <Typography>Registered Date: {selectedUser.createdAt || "N/A"}</Typography>
            </>
          }
          scrollType="paper"
          actionText1="Close"
          actionText2="Edit"
          open={viewUserDetails}
          onClose={() => setViewUserDetails(false)}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ScrollDialog
        buttonLabel="Confirm Delete"
        dialogTitle="Confirm Delete"
        dialogContent={<Typography>Are you sure you want to delete this user?</Typography>}
        scrollType="body"
        actionText1="Cancel"
        actionText2="Confirm"
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Edit User Form */}
      <ScrollDialog
        buttonLabel="Edit User"
        dialogTitle="Edit User"
        dialogContent={
          selectedUser && (
            <SignUpForm role={selectedRole} selectedUser={selectedUser.id} />
          )
        }
        scrollType="body"
        actionText1="Cancel"
        actionText2="Confirm"
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={handleEdit}
      />

      {/* Sign Up User Dialog */}
      <ScrollDialog
        buttonLabel="Sign Up"
        dialogTitle="Sign Up User"
        dialogContent={
          selectedRole === "student" ? (
            <SignUpStudent />
          ) : selectedRole === "instructor" ? (
            <SignUpInstructor />
          ) : (
            <SignUpAdmin />
          )
        }
        scrollType="body"
        actionText1="Cancel"
        actionText2="Confirm"
        open={signUpDialogOpen}
        onClose={() => setSignUpDialogOpen(false)}
      />
    </Box>
  );
};

export default withDashboardWrapper(UserManagement);
