import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableSortLabel,
  TablePagination, Box, TextField, Typography, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import { tokens } from "../pages/dashboard/theme";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const formatCellData = (data) => {
  if (data instanceof Date) {
    return data.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (data && typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
    return new Date(data.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (typeof data === 'string' && !isNaN(Date.parse(data))) {
    return new Date(data).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return data;
};

const TableComponent = ({
  columns,
  tableHeader,
  data,
  sortBy,
  sortDirection,
  onSortChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (data) {
      setFilteredData(data.filter((row) =>
        columns.some((column) =>
          String(row[column.id]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
    }
  }, [searchQuery, data, columns]);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      {data ? (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '75vh',
            overflow: 'auto',
            backgroundColor: colors.primary[400],
            marginTop: '10px',
            overflowX: 'auto', // Add horizontal scrolling
          }}
        >
          <Box
            display="flex"
            flexDirection={isSmallScreen ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isSmallScreen ? 'flex-start' : 'center'}
            p={2}
            gap={isSmallScreen ? 2 : 0}
          >
            <Typography variant={isSmallScreen ? 'h4' : 'h2'}>{tableHeader}</Typography>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size={isSmallScreen ? 'small' : 'medium'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth={isSmallScreen}
            />
          </Box>
          <Divider />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontWeight: '900',
                      fontSize: isSmallScreen ? '0.8rem' : '1rem',
                      backgroundColor: colors.primary[400],
                      whiteSpace: 'nowrap', // Prevent text overflow
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => onSortChange(column.id)}
                      IconComponent={sortDirection === 'asc' ? ArrowUpward : ArrowDownward}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                  sx={{
                    '&:hover': {
                      backgroundColor: colors.blueAccent[200],
                      '& td': { color: '#fff' },
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.renderCell ? column.renderCell(row) : formatCellData(row[column.id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableContainer>
      ) : (
        <Typography>Data unavailable</Typography>
      )}
    </div>
  );
};

export default TableComponent;
