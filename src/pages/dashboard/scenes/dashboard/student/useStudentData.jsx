import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endpoints } from '../../../../../utils/constants';
import useApi from "../../../../../hooks/useApi";
import { setAssignments, setTimetable } from '../../../../../reduxStore/slices/studentdataSlice'; // Import dispatch actions

const useStudentData = () => {
  const [timePastTimetables, setTimePastTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [nextClass, setNextClass] = useState(null);

  const studentData = useSelector((state) => state.users.user);
  const dispatch = useDispatch(); // Initialize dispatch

  const { data: timeTableData, callApi: timeTableFetch, loading: timeTableLoading } = useApi();
  const { data: courseData, callApi: courseFetch, loading: courseLoading } = useApi();
  const { data: assignmentData, callApi: assignementFetch, loading: assignmentLoading } = useApi();

  // Fetch timeTable data when student data is available and cohort is present
  useEffect(() => {
    if (studentData && studentData.cohort) {
      timeTableFetch(`${endpoints.TIMETABLE}/${studentData.cohort}`, 'GET');
    }
  }, [studentData, timeTableFetch]);

  useEffect(() => {
    if (studentData && studentData.cohort) {
      assignementFetch(`${endpoints.ASSIGNMENT}/${studentData.cohort}`, 'GET');
    }
  }, [studentData, assignementFetch]);

  // Dispatch timetable data to Redux
  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      dispatch(setTimetable(timeTableData)); // Dispatch timetable data to Redux store
    }
  }, [timeTableData, dispatch]);

  // Dispatch assignment data to Redux store
  useEffect(() => {
    if (assignmentData) {
      dispatch(setAssignments(assignmentData)); // Dispatch assignments data to Redux store
    }
  }, [assignmentData, dispatch]);

  // Fetch courses data
  useEffect(() => {
    courseFetch(`${endpoints.COURSES}`, 'GET');
  }, [courseFetch]);

  // Set courses data when received from the API
  useEffect(() => {
    if (courseData) {
      setCourses(courseData.courses);
    }
  }, [courseData, studentData]);

  // Update timePastTimetables when timeTableData is updated
  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      const currentDateTime = new Date();
      const pastTimetables = timeTableData.filter(timetable => {
        const timetableDateTime = new Date(`${timetable.date}T${timetable.time}`);
        return timetableDateTime < currentDateTime;
      });
      setTimePastTimetables(pastTimetables);
    }
  }, [timeTableData]);

  // Helper function to format the date
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      const currentDateTime = new Date();
      let closestClass = null;

      // Loop through the timeTableData and find the closest date/time in the future
      timeTableData.forEach(timetable => {
        const timetableDateTime = new Date(`${timetable.date.split('T')[0]}T${timetable.time}`);

        if (timetableDateTime > currentDateTime) {
          if (!closestClass || timetableDateTime < new Date(`${closestClass.date.split('T')[0]}T${closestClass.time}`)) {
            closestClass = timetable;
          }
        }
      });

      // If a next class is found, format the date and set it
      if (closestClass) {
        // Create a new object by spreading the properties of closestClass and adding the formattedDate property
        const formattedClass = {
          ...closestClass,  // Spread the properties of closestClass
          formattedDate: formatDateToDDMMYYYY(closestClass.date),  // Add the formatted date
        };
        setNextClass(formattedClass);  // Set the new object with formatted date
      }
    }
  }, [timeTableData]);

  if (!studentData || typeof studentData !== 'object') {
    return {
      completedCourses: [],
      remainingCourses: [],
      progressPercentage: 0,
      timePastTimetables: [],
      nextClass: null,
      attendanceRate: 0,
      outstandings: { totalOutstanding: 0, percentageDifference: 0 },
      loading: timeTableLoading || courseLoading,
    };
  }

  const {
    completedCourses,
    remainingCourses,
    progressPercentage,
    attendanceRate,
    outstandings,
  } = useMemo(() => {
    const completedCourses = [];
    const remainingCourses = [];

    // Iterate through courses and segregate completed and remaining topics
    courses.forEach(course => {
      const { curriculum } = course;
      if (Array.isArray(curriculum)) {
        curriculum.forEach(topic => {
          if (topic.isCompleted) {
            completedCourses.push(topic);
          } else {
            remainingCourses.push(topic);
          }
        });
      }
    });

    // Calculate progress percentage based on completed and remaining topics
    const totalTopics = completedCourses.length + remainingCourses.length;
    const progressPercentage = totalTopics > 0
      ? (completedCourses.length / totalTopics) * 100
      : 0;

    // Filter the timetables that are marked as 'done'
    const completedTimetables = timePastTimetables.filter(timetable => timetable.done);

    // Calculate the number of completed classes the student attended
    const attendedClasses = timeTableData && timeTableData.filter(timetable =>
      timetable.attendance.includes(studentData.userId)
    ).length;
    console.log(attendedClasses);

    // Calculate attendance rate based on the attended classes and completed timetables
    const totalDoneTimetables = timeTableData && timeTableData.length;
    const attendanceRate = totalDoneTimetables > 0
      ? (attendedClasses / totalDoneTimetables) * 100
      : 0;

      console.log(attendanceRate)

    // Calculate outstanding amount and percentage
    const amountPaid = studentData.amountPaid || 0;
    const totalCost = courses.reduce((acc, course) => {
      const cost = parseInt(course.cost, 10) || 0;
      return acc + cost;
    }, 0);

    const totalOutstanding = totalCost - amountPaid;
    const percentageDifference = totalCost > 0
      ? (totalOutstanding / totalCost) * 100
      : 0;

    return {
      completedCourses,
      remainingCourses,
      progressPercentage,
      attendanceRate,  // Updated attendance rate calculation
      outstandings: { totalOutstanding, percentageDifference, amountPaid },
    };
  }, [courses, timePastTimetables, studentData]);

  return {
    completedCourses,
    remainingCourses,
    progressPercentage,
    timePastTimetables,
    nextClass, // Return nextClass in the return object
    attendanceRate,
    outstandings,
    studentData,
    timeTableData,
    loading: timeTableLoading || courseLoading,
    formatDateToDDMMYYYY
  };
};

export default useStudentData;
