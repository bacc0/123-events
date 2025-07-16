import React, { useState } from 'react';

export const EventDetailsModal = ({ event, onClose }) => (
     <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
               <div className="modal-header">
                    <h2 className="modal-title">{event.title}</h2>
                    <button className="close-button" onClick={onClose}>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                         </svg>
                    </button>
               </div>
               <div className="modal-body">
                    {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="modal-image" onError={(e) => { e.target.style.display = 'none'; }} />}
                    <div style={{ display: 'grid', gap: '20px' }}>
                         <div className="detail-item">
                              <div className="detail-label">Date & Time</div>
                              <div className="detail-value">{new Date(event.date).toLocaleDateString('en-GB')} at {event.time}</div>
                         </div>
                         <div className="detail-item">
                              <div className="detail-label">Location</div>
                              <div className="detail-value">{event.location}</div>
                         </div>
                         <div className="detail-item">
                              <div className="detail-label">Description</div>
                              <div className="detail-value">{event.description}</div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
);

export const EditEventModal = ({ event, onSave, onClose }) => {
     const [formData, setFormData] = useState({ ...event, imageUrl: event.imageUrl || "" });
     const [imagePreview, setImagePreview] = useState(event.imageUrl || "");
     const [imageFile, setImageFile] = useState(null);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     const handleImageChange = (e) => {
          if (e.target.files && e.target.files[0]) {
               const file = e.target.files[0];
               const reader = new FileReader();
               reader.onloadend = () => setImagePreview(reader.result);
               reader.readAsDataURL(file);
               setImageFile(file);
          }
     };

     const handleSubmit = (e) => {
          e.preventDefault();
          if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
               alert("Please fill in all required fields.");
               return;
          }
          onSave({ ...formData, imageFile: imageFile });
     };

     return (
          <div className="modal-overlay" onClick={onClose}>
               <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                         <h2 className="modal-title">Edit Event</h2>
                         <button className="close-button" onClick={onClose}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                   <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                         </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                         <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                         <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                         <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                         <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                         <input type="file" onChange={handleImageChange} />
                         {imagePreview && <img src={imagePreview} alt="Preview" />}
                         <textarea name="description" value={formData.description} onChange={handleChange} required />
                         <button type="submit">Save</button>
                    </form>
               </div>
          </div>
     );
};

export const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText }) => (
     <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
               <h3>{title}</h3>
               <p>{message}</p>
               <button onClick={onCancel}>Cancel</button>
               <button onClick={onConfirm}>{confirmText}</button>
          </div>
     </div>
);