import React, { useEffect, useState } from 'react';
import Student from './student';
import Instructor from './instructor';
import { useSelector } from 'react-redux';

const TimeTable = () => {
     // Fetch user data from localStorage
     const user = useSelector((state) => state.users.user);

     const userRole = user.role;

   // Render based on user role
   return (
     <div>
       {userRole === 'student' ? <Student /> : <Instructor babtechUser = {user}/>}
     </div>
   );
 };

export default TimeTable;
