import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box } from '@mui/material';
import { tokens } from '../../../theme';
import { useSelector } from 'react-redux';

const PerfromanceLineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const [lineData, setLineData] = useState([]);
  const [performance, setPerformance] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const students = useSelector((state) => state.adminData.usersData.students);
  const assignmentData = useSelector((state) => state.student.assignments);
  const timeTableData = useSelector((state) => state.student.timetable);
  const userId = useSelector((state) => state.users.user.userId);
  const studentId = useSelector((state) => state.users.user.studentId);

  // Helper function to generate color for lines dynamically
  const generateColor = (index) => {
    const hue = (index * 360) / 10 % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Helper function to calculate monthly data for assignment submissions and attendance
  const processMonthlyData = (data, studentId, type) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const aggregatedData = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const month = date.getMonth();
      const monthName = months[month];

      if (!aggregatedData[monthName]) {
        aggregatedData[monthName] = { total: 0, attended: 0 };
      }

      if (type === 'attendance' && item.done) {
        if (item.attendance && item.attendance.includes(studentId)) {
          aggregatedData[monthName].attended += 1;
        }
        aggregatedData[monthName].total += 1;
      }

      if (type === 'assignment') {
        if (item.submissions && item.submissions.some(submission => submission.studentId === studentId)) {
          aggregatedData[monthName].attended += 1;
        }
        aggregatedData[monthName].total += 1;
      }
    });

    const processedData = months.map(month => {
      const monthData = aggregatedData[month] || { total: 0, attended: 0 };
      const rate = monthData.total > 0 ? (monthData.attended / monthData.total) * 100 : 0;
      return { x: month, y: rate };
    });

    return processedData;
  };

  // Helper function to calculate student performance grade based on combined rate
  const calculatePerformance = (attendanceRate, assignmentRate) => {
    if (attendanceRate === 0 && assignmentRate === 0) {
      return "Yet to start classes";
    }

    const combinedRate = (attendanceRate + assignmentRate) / 2;

    if (combinedRate >= 90) {
      return "A";
    } else if (combinedRate >= 80) {
      return "B";
    } else if (combinedRate >= 70) {
      return "C";
    } else if (combinedRate >= 60) {
      return "D";
    } else {
      return "E";
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        if (students && students.length > 0) {
          const years = Array.from(new Set(students.map(user => new Date(user.createdAt).getFullYear())));
          const selectedYear = years.includes(currentYear) ? currentYear : Math.max(...years);
          setCurrentYear(selectedYear);

          const assignmentMonthlyData = processMonthlyData(assignmentData, studentId, 'assignment');
          const attendanceMonthlyData = processMonthlyData(timeTableData, studentId, 'attendance');

          const assignmentRate = assignmentMonthlyData.reduce((acc, curr) => acc + curr.y, 0) / assignmentMonthlyData.length;
          const attendanceRate = attendanceMonthlyData.reduce((acc, curr) => acc + curr.y, 0) / attendanceMonthlyData.length;

          const grade = calculatePerformance(attendanceRate, assignmentRate);
          setPerformance(grade);

          const formattedData = [
            {
              id: "Assignments Submitted",
              color: isCustomLineColors ? generateColor(0) : colors.primary[500],
              data: assignmentMonthlyData
            },
            {
              id: "Classes Attended",
              color: isCustomLineColors ? generateColor(1) : colors.primary[600],
              data: attendanceMonthlyData
            }
          ];

          setLineData(formattedData);
        } else {
          console.warn("No data available or data array is empty.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [assignmentData, timeTableData, students, studentId, isCustomLineColors, colors.primary, currentYear]);

  if (lineData.length === 0) {
    return <Box sx={{display: 'grid', placeContent:'center'}}><p>Your cohort is yet to get a time-table</p></Box>;
  }

  return (
    <Box width="98%" height="100%">

      
      {performance !== "Yet to start classes" && (
        <Box>
          <h2>Student Performance: {performance}</h2>
        </Box>
      )}
      {performance === "Yet to start classes" && (
        <Box>
          <h2>Yet to start classes</h2>
        </Box>
      )}
      <ResponsiveLine
        data={lineData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
                fontSize: 8,
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
                fontSize: 8,
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
              fontSize: 8,
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={isCustomLineColors ? { datum: 'color' } : { scheme: 'nivo' }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Percentage',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default PerfromanceLineChart;
