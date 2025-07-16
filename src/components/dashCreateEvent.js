import React, { useState } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateEventPage = ({ onSave, onCancel }) => {
     const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
     const [imagePreview, setImagePreview] = useState('');
     const [uploading, setUploading] = useState(false);

     const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

     const handleImageChange = async (e) => {
          if (e.target.files && e.target.files[0]) {
               const file = e.target.files[0];
               const reader = new FileReader();
               reader.onloadend = () => {
                    setImagePreview(reader.result);
               };
               reader.readAsDataURL(file);

               try {
                    setUploading(true);
                    const storage = getStorage();
                    const imageRef = storageRef(storage, `event_images/${Date.now()}_${file.name}`);
                    await uploadBytes(imageRef, file);
                    const url = await getDownloadURL(imageRef);
                    setFormData(prev => ({ ...prev, imageUrl: url }));
                    console.log("✅ Image uploaded immediately:", url);
               } catch (error) {
                    console.error("❌ Image upload error:", error);
                    alert("There was an error uploading the image. Please try again.");
               } finally {
                    setUploading(false);
               }
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
               alert("Please fill in all required fields.");
               return;
          }

          if (!formData.imageUrl) {
               alert("Please wait for the image to finish uploading before submitting.");
               return;
          }

          onSave({ ...formData, id: Date.now(), attendees: 0, status: 'upcoming' });
     };

     return (
          <main className="main-content">
               <div className="section-header">
                    <h1 className="section-title page-title">Create New Event</h1>
                    <button className="btn btn-outline" onClick={onCancel}>
                         <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                         </svg>
                         Back to Dashboard
                    </button>
               </div>
               <div className="card card-padded">
                    <form onSubmit={handleSubmit} className="form">
                         <div className="form-group">
                              <label className="form-label" htmlFor="title">Event Title</label>
                              <input className="form-input" type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Summer Music Festival" required />
                         </div>
                         <div className="form-row">
                              <div className="form-group">
                                   <label className="form-label" htmlFor="date">Date</label>
                                   <input className="form-input" type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                              </div>
                              <div className="form-group">
                                   <label className="form-label" htmlFor="time">Time</label>
                                   <input className="form-input" type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                              </div>
                         </div>
                         <div className="form-group">
                              <label className="form-label" htmlFor="location">Location</label>
                              <input className="form-input" type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Hyde Park, London" required />
                         </div>
                         <div className="form-group">
                              <label className="form-label">Event Image</label>
                              <input type="file" id="image-upload-create" accept="image/*" onChange={handleImageChange} className="hidden" />
                              <label htmlFor="image-upload-create" className="image-upload">
                                   {uploading ? "Uploading image..." : "Click to upload image"}
                              </label>
                              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                         </div>
                         <div className="form-group">
                              <label className="form-label" htmlFor="description">Description</label>
                              <textarea className="form-textarea" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your event..." required />
                         </div>
                         <div className="modal-footer" style={{ padding: 0, borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                              <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
                              <button type="submit" className="btn btn-primary">Create Event</button>
                         </div>
                    </form>
               </div>
          </main>
     );
};

export default CreateEventPage;