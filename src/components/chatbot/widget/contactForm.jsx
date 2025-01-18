import React, { useState } from 'react';
import styled from 'styled-components';
import ChatbotBtn from '../chatbotBtn';
import BtnWrapperStyle from '../btnWrapperstyle';
import { submitEnquiry } from '../../../firebase/utils'; 
import useApi from '../../../hooks/useApi';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', message: '', phoneNumber: '' });
  const { callApi, loading, error } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await callApi('http://localhost:3500/api/v1/enquiries', 'POST', formData);
      console.log('Enquiry submitted successfully:', result);
      setFormData({ name: '', message: '', phoneNumber: '' }); 
    } catch (err) {
      console.error('Error submitting enquiry:', err.message);
    }
  };

  return (
    <StyledEnquiryForm>
      <StyledInput
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <StyledTextArea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
      />
      <BtnWrapperStyle>
        <ChatbotBtn onClick={handleSubmit}>Submit Enquiry</ChatbotBtn>
      </BtnWrapperStyle>
    </StyledEnquiryForm>
  );
};

const StyledEnquiryForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  height: 3em;
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 0 10px;
`;

const StyledTextArea = styled.textarea`
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 10px;
  resize: none;
  height: 5em;
`;

export default ContactForm;
