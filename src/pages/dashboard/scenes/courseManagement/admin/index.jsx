import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
  useTheme,
  Tooltip,
} from '@mui/material';
import { tokens } from '../../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import Header from "../../../components/Header";
import Modal from "../../../components/modal";
import useCourses from './useCourses';
import { AddCurriculumModal, AddCourseModal, AddCohortModal, COurseDetailsModal, CurriculumList } from './courseModals';
import { useSelector } from 'react-redux';
import TableComponent from "../../../../../components/table"; // Import your custom TableComponent
import CustomIconButton from '../../../components/customIconButton';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleUpdateCourse,
    handleAddCurriculum,
    addCurriculumOpen,
    courses,
    addCourseModalOpen,
    updateCurriculumModalOpen,
    deleteCourseModal,
    selectedCourse,
    handleAddCourse,
    handleUpdateCurriculum,
    handleDeleteCourse,
    openAddCourseModal,
    closeAddCourseModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    openCohortAddModal,
    closeCohortAddModal,
    openAddCurriculumModal,
    closeAddCurriculumModal,
    cohortAddModalOpen,
    openCurriculumList,
    openCurriculum,
    closeCurriculum,
    openCourseDetails,
    closeDeleteCourseModal,
    openDeleteCourseModal,
    setSelectedCourse, // Ensure this is available to set the selected course
    e // To manage modal mode (add or update)
  } = useCourses();

  const userRole = useSelector((state) => state.users.user.role);

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState('courseName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState('');
  const [courseId, setCourseId] = useState('');



  // Prefill the form if updating a course
  useEffect(() =>{
    const modalType = JSON.parse(sessionStorage.getItem('modalType')) ;
    const courseid = JSON.parse(sessionStorage.getItem('selectedCourseId')) ;
      setCourseId(courseid);
      setIsUpdating(modalType);
  }, [isUpdating]);

  // Columns for the Table
  const columns = [
    { id: 'sn', label: 'S/N' }, // Adding serial number column
    { id: 'courseName', label: 'Course Name' },
    { id: 'description', label: 'Description' },
    { id: 'duration', label: 'Duration' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'cost', label: 'Cost' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Tooltip title="View Details">
            <CustomIconButton 
              onClick={() => {
                openCourseDetailsModal(row);
                sessionStorage.setItem('selectedCourse', JSON.stringify(row));
              icon: {<VisibilityIcon />
              }
              }}>
            </CustomIconButton>
          </Tooltip>
          <Tooltip title="Edit Course">
            <IconButton
              onClick={() => {
                console.log(row)
                sessionStorage.setItem('selectedCourseId', JSON.stringify(row.id));
                openAddCourseModal('update'); // Open the course modal for editing
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Course">
            <IconButton onClick={() => {openDeleteCourseModal(row)}}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage Curriculum">
            <Button onClick={() => openCurriculum(row)} variant="contained" color="primary">
              Curriculum
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];


  const rows = courses.map((course, index) => ({
    sn: index + 1, // Adding serial number (S/N)
    id: course.courseId,
    courseName: course.courseName,
    description: course.description,
    duration: course.duration,
    startDate: course.startDate,
    cost: course.cost,
  }));

  // Handle sorting changes
  const handleSortChange = (columnId) => {
    const isAscending = sortBy === columnId && sortDirection === 'asc';
    setSortBy(columnId);
    setSortDirection(isAscending ? 'desc' : 'asc');
  };

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page change
  };

  // Handle row click to open course details
  const handleRowClick = (row) => {
    console.log('clicked')
  };

  // Filter data based on search query
  const filteredRows = rows.filter((row) => {
    return row.courseName.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <Grid container>
      <Grid item xs={12}>
        <Header
          title='Course Management'
          subtitle= 'Manage Courses'
        />
      </Grid>

      {userRole === 'admin' || userRole === 'superadmin' && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>

              {/* Display courses using TableComponent */}
              <TableComponent
                columns={columns}
                tableHeader="Course Management"
                data={filteredRows}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRowClick={handleRowClick}
                hiddenColumnsSmallScreen={[ 'description', 'duration', 'cost']}
                hiddenColumnsTabScreen={[ 'description',  'duration']}
              />

              <Button onClick={() => {openAddCourseModal('add')}} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Add Course
              </Button>
            </Paper>
          </Grid>
      )}

      {/* Course Details Modal */}
      <Modal open={openCourseDetails} onClose={closeCourseDetailsModal} title={selectedCourse?.courseName}>
        {selectedCourse && (
          <COurseDetailsModal
            userRole={userRole}
            selectedCourse={selectedCourse}
            openAddCurriculumModal={openAddCurriculumModal}
            openCohortAddModal={openCohortAddModal}
          />
        )}
      </Modal>

      {/* Modals for Adding Course, Cohort, and Curriculum */}
      <Modal open={addCourseModalOpen} onClose={closeAddCourseModal} title='Course'>
        <AddCourseModal
          course={selectedCourse} // Pass the selected course for editing
        />
      </Modal>

      <Modal open={cohortAddModalOpen} onClose={closeCohortAddModal} title="Add Cohort" noConfirm>
        <AddCohortModal courseId={selectedCourse?.id} />
      </Modal>

      {/* Add Curriculum Modal */}
      <Modal open={addCurriculumOpen} onClose={closeAddCurriculumModal} title="Add Curriculum" noConfirm>
        <AddCurriculumModal courseId={selectedCourse?.id} />
      </Modal>

      {/* Curriculum Modal */}
      <Modal open={openCurriculumList} onClose={closeCurriculum} title="Curriculum" noConfirm>
        <CurriculumList id={selectedCourse?.id} noConfirm />
      </Modal>
      
      {/* delet course modal */}
      <Modal open={deleteCourseModal} onClose={closeDeleteCourseModal} title="Delete Course" onConfirm={() => {handleDeleteCourse(courseId)}}>
        <p>Deleting this course means that you will delete all Cohorts and Chat rooms attached to this course. Kindly click on confirm to continue </p>
      </Modal>
    </Grid>
  );
};

export default Admin;
