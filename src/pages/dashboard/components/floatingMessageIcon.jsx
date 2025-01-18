// FloatingMessageIcon.js
import React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useLocation} from 'react-router-dom';

const FloatingMessageIcon = () => {
const navigate = useNavigate();
const path = useLocation().pathname;


  const handleMessage = ()  => {
    navigate('/dashboard/messenger');
  }
  return (
    <div>
        {
      path === '/dashboard/messenger' ? null :
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={handleMessage}>
      <Fab color="primary" aria-label="chat">
        <ChatIcon />
      </Fab>
    </div>
    }
    </div>
   
  );
};

export default FloatingMessageIcon;
