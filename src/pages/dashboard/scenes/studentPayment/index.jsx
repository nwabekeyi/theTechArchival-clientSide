import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, LinearProgress,
  useTheme} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import TableComponent from '../../../../components/table';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { useSelector } from 'react-redux';
import Modal from '../../components/modal'; 
import Receipt from '../../components/Receipt';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useStudentData from "../dashboard/student/useStudentData";
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const PaymentHistory = () => {
  const user = useSelector((state) => state.users.user);
  const { loading, data, callApi } = useApi();
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { outstandings } = useStudentData(); // Destructure outstandings from the custom hook

  console.log(user)

  // Get total outstanding and paid amounts
   const { totalOutstanding, amountPaid } = outstandings;

   // Calculate total amount due
   const totalAmount = totalOutstanding + amountPaid;
 
   // Calculate payment percentage
   const paymentPercentage = totalAmount > 0 ? (amountPaid / totalAmount) * 100 : 0;

  // Fetch Receipts Data
  useEffect(() => {
    if (user?.userId) {
      callApi(`${endpoints.PAYMENT}/student/${user.userId}`, 'GET');
    }
  }, [user?.userId]);

  useEffect(() => {
    if (!loading && data) {
      const transformedReceipts = data.receipts.map((receipt, index) => ({
        id: index + 1,
        transactionId: receipt.paymentDetails.transactionId,
        amount: receipt.paymentDetails.amount,
        status: receipt.paymentDetails.status,
        date: new Date(receipt.paymentDetails.timestamp).toLocaleDateString(),
        userName: `${receipt.userDetails.firstName} ${receipt.userDetails.lastName}`,
        program: receipt.userDetails.program,
      }));
      setReceipts(transformedReceipts);
    }
  }, [loading, data]);

  // Handle sorting
  const handleSortChange = (field) => {
    const isAsc = sortBy === field && sortDirection === 'asc';
    setSortBy(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  // Action Handlers
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenReceiptModal(true);
  };

  const handleDeletePayment = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenDeleteModal(true);
  };

  const confirmDeletePayment = async () => {
    if (selectedReceipt) {
      try {
        const response = await callApi(
          `${endpoints.PAYMENT}/delete/${selectedReceipt.transactionId}`,
          'DELETE'
        );
        if (response) {
          setReceipts((prev) =>
            prev.filter((r) => r.transactionId !== selectedReceipt.transactionId)
          );
        }
      } catch (error) {
        console.error('Error deleting payment:', error);
      } finally {
        setOpenDeleteModal(false);
      }
    }
  };

  // Table Columns
  const columns = [
    { id: 'transactionId', label: 'Transaction ID' },
    { id: 'userName', label: 'Student Name' },
    { id: 'program', label: 'Program' },
    {
      id: 'amount',
      label: 'Amount (₦)',
      renderCell: (row) => `₦${(row.amount / 100).toFixed(2)}`, // Assuming amount is in kobo
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (row) =>
        row.status.charAt(0).toUpperCase() + row.status.slice(1),
    },
    { id: 'date', label: 'Date' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <Box display="flex" gap="10px">
          <IconButton onClick={() => handleViewReceipt(row)}>
            <Visibility />
          </IconButton>
          <IconButton onClick={() => handleDeletePayment(row)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
         <Header title="Payment History" subtitle="Overview of Payments Made" />

         <Box backgroundColor={colors.primary[400]} p="20px" borderRadius="4px">
        <Typography variant="h5" fontWeight="600" mb="15px">
          Payment Summary
        </Typography>
        <Box mb="20px">
          <Typography variant="h6" mb="5px">
            Total Amount Due: ₦{totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="h6" mb="5px">
            Total Paid: ₦{amountPaid.toFixed(2)}
          </Typography>
          <Typography variant="h6" mb="15px">
            Payment Percentage: {paymentPercentage.toFixed(2)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={paymentPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors.greenAccent[500],
              },
            }}
          />
        </Box>

      <TableComponent
        columns={columns}
        tableHeader="Payment Records"
        data={receipts}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        onRowClick={(row) => console.log('Row clicked:', row)}
      />

      {/* View Receipt Modal */}
      <Modal
        open={openReceiptModal}
        onClose={() => setOpenReceiptModal(false)}
        title="Receipt Details"
      >
        {selectedReceipt && <Receipt receipt={selectedReceipt} />}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenReceiptModal(false)}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Confirm Deletion"
        onConfirm={confirmDeletePayment}
      >
        <Typography>
          Are you sure you want to delete this payment record?
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={confirmDeletePayment}
          sx={{ mt: 2 }}
        >
          Confirm
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenDeleteModal(false)}
          sx={{ mt: 2, ml: 2 }}
        >
          Cancel
        </Button>
      </Modal>
    </Box>
    </Box>
  );
};

export default withDashboardWrapper(PaymentHistory);
