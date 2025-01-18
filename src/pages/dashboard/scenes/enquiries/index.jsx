

// import React from 'react';
// import { useEnquiries } from './useEnquiries'; 

// const Enquiries = () => {
//   const {
//     enquiries,
//     loading,
//     error,
//     markAsRead,
//     removeEnquiry,
//     openDeleteModal,
//     closeDeleteModal,
//     confirmDeleteModal,
//   } = useEnquiries();

//   if (loading) return <p>Loading enquiries...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Enquiries</h1>
//       {enquiries.length === 0 ? (
//         <p>No enquiries found.</p>
//       ) : (
//         <ul>
//           {enquiries.map((enquiry) => (
//             <li key={enquiry._id}>
//               <p>{enquiry.message}</p>
//               <p>Status: {enquiry.read ? 'Read' : 'Unread'}</p>
//               <button onClick={() => markAsRead(enquiry._id)}>
//                 Mark as {enquiry.read ? 'Unread' : 'Read'}
//               </button>
//               <button onClick={openDeleteModal}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//       {confirmDeleteModal && (
//         <div className="modal">
//           <p>Are you sure you want to delete this enquiry?</p>
//           <button onClick={closeDeleteModal}>Cancel</button>
//           <button
//             onClick={() => {
//               const enquiryToDelete = enquiries.find((e) => e._id);
//               if (enquiryToDelete) removeEnquiry(enquiryToDelete._id);
//               closeDeleteModal();
//             }}
//           >
//             Confirm Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Enquiries;


import React from 'react';
import { useEnquiries } from './useEnquiries'; 
import Modal from '../../components/modal';

const Enquiries = () => {
  const {
    enquiries,
    selectedEnquiry,
    loading,
    error,
    openModal,
    closeModal,
    confirmDeleteModal,
    removeEnquiry,
  } = useEnquiries();

  return (
    <div>
      <h1>Enquiries</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && enquiries.length === 0 && <p>No enquiries found.</p>}

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {enquiries.map((enquiry) => (
          <li
            key={enquiry._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'center',
              padding: '10px 0',
              margin: '10px',
              gap: '15px',
            }}
          >
            <span>{enquiry.name}</span>
            <span
              onClick={() => openModal(enquiry)}
              style={{
                cursor: 'pointer',
                color: '#007bff',
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Details →
            </span>
          </li>
        ))}
      </ul>
  
  {confirmDeleteModal && selectedEnquiry && (
    <Modal
      open={confirmDeleteModal} 
      onClose={closeModal} 
      aria-labelledby="enquiry-modal-title"
      aria-describedby="enquiry-modal-description"
    >
      <div className="modal-content">
        {/* Display the enquiry details */}
        <h2 id="enquiry-modal-title" style={{ marginBottom: '10px' }}>
          {selectedEnquiry.name}
        </h2>
        <p id="enquiry-modal-description" style={{ margin: '10px 0' }}>
          {selectedEnquiry.message}
        </p>
        <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
          Status: {selectedEnquiry.read ? 'Read' : 'Unread'}
        </p>
  
        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            onClick={() => {
              removeEnquiry(selectedEnquiry._id);
              closeModal();
            }}
            className="modal-delete-btn"
          >
            Delete
          </button>
          <button
            onClick={() => {
              markAsRead(selectedEnquiry._id);
              closeModal();
            }}
            className="modal-mark-read-btn"
          >
            Mark as Read
          </button>
          <button onClick={closeModal} className="modal-close-btn">
            Close
          </button>
        </div>
      </div>
    </Modal>
  )}
  

    </div>
  );
};

export default Enquiries;
