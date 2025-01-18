

// import { useState, useEffect } from 'react';
// import useApi from '../../../../hooks/useApi';

// export const useEnquiries = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [error, setError] = useState(null);
//   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
//   const { callApi, loading } = useApi();

//   // Open/close delete modal
//   const openDeleteModal = () => setConfirmDeleteModal(true);
//   const closeDeleteModal = () => setConfirmDeleteModal(false);

//   // Fetch all enquiries
//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       setError(null);
//       try {
//         const data = await callApi(
//           `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}`,
//           'GET'
//         );
//         setEnquiries(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error('Error fetching enquiries:', err);
//         setError('Failed to fetch enquiries');
//       }
//     };

//     fetchEnquiries();
//   }, [callApi]);

//   // Mark an enquiry as read
//   const markAsRead = async (id) => {
//     try {
//       const updatedEnquiry = await callApi(
//         `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}/${id}`,
//         'PATCH'
//       );
//       setEnquiries((prev) =>
//         prev.map((enquiry) =>
//           enquiry._id === id ? { ...enquiry, read: updatedEnquiry.read } : enquiry
//         )
//       );
//     } catch (err) {
//       console.error('Error updating enquiry:', err);
//       setError('Failed to update enquiry');
//     }
//   };

//   // Remove an enquiry
//   const removeEnquiry = async (id) => {
//     try {
//       await callApi(
//         `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}/${id}`,
//         'DELETE'
//       );
//       setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
//     } catch (err) {
//       console.error('Error deleting enquiry:', err);
//       setError('Failed to delete enquiry');
//     }
//   };

//   return {
//     enquiries,
//     loading,
//     error,
//     markAsRead,
//     removeEnquiry,
//     openDeleteModal,
//     closeDeleteModal,
//     confirmDeleteModal,
//   };
// };



import { useState, useEffect } from 'react';
import useApi from '../../../../hooks/useApi';

export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const { callApi, loading } = useApi();

  // Fetch all enquiries
  useEffect(() => {
    const fetchEnquiries = async () => {
      setError(null);
      try {
        const data = await callApi(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}`, 'GET');
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
        setError('Failed to fetch enquiries');
      }
    };

    fetchEnquiries();
  }, [callApi]);

  // Mark an enquiry as read
  const markAsRead = async (id) => {
    try {
      const updatedEnquiry = await callApi(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}/${id}`, 'PATCH');
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, read: updatedEnquiry.read } : enquiry
        )
      );
    } catch (err) {
      console.error('Error updating enquiry:', err);
      setError('Failed to update enquiry');
    }
  };

  // Remove an enquiry
  const removeEnquiry = async (id) => {
    try {
      await callApi(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRIES_ENDPOINT}/${id}`, 'DELETE');
      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      setError('Failed to delete enquiry');
    }
  };

  // Open modal for selected enquiry
  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    markAsRead(enquiry._id); // Mark as read when modal opens
    setConfirmDeleteModal(true);
  };

  const closeModal = () => {
    setSelectedEnquiry(null);
    setConfirmDeleteModal(false);
  };

  return {
    enquiries,
    selectedEnquiry,
    loading,
    error,
    openModal,
    closeModal,
    confirmDeleteModal,
    removeEnquiry,
  };
};
