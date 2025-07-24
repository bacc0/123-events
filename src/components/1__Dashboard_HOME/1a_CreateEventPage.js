import React, { useState } from 'react';
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp, getFirestore, collection, addDoc } from "firebase/firestore";

import { get as dbGet } from "firebase/database";

const getUidFromEmail = async (email) => {
     const db = getDatabase();
     const emailKey = email.replace(/\./g, ",");

     // Check if a UID is mapped to the email
     const usersRef = ref(db, `users`);
     const usersSnapshot = await dbGet(usersRef);
     const usersData = usersSnapshot.val();

     if (usersData) {
          for (const uid in usersData) {
               if (usersData[uid]?.email === email) {
                    return uid;
               }
          }
     }

     // Fallback to emailKey if no UID found
     return emailKey;
};



export default function CreateEventPage({ onSave, onCancel }) {

     const [formData, setFormData] = useState({
          title: "",
          date: "",
          time: "",
          location: "",
          description: "",
          imageUrl: "",
     });
     const [imagePreview, setImagePreview] = useState("");
     const [uploading, setUploading] = useState(false);

     const [inviteEmails, setInviteEmails] = useState([]);
     const [emailInput, setEmailInput] = useState('');


     const handleEmailChange = (e) => {
          setEmailInput(e.target.value);
     };

     const handleEmailBlur = () => {
          const emails = emailInput
               .split(',')
               .map(email => email.trim())
               .filter(email => email.length > 0);

          setInviteEmails(emails);
     };


     const handleChange = (e) =>
          setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
                    const imageRef = storageRef(
                         storage,
                         `event_images/${Date.now()}_${file.name}`,
                    );
                    await uploadBytes(imageRef, file);
                    const url = await getDownloadURL(imageRef);
                    setFormData((prev) => ({ ...prev, imageUrl: url }));
                    console.log("✅ Image uploaded immediately:", url);
               } catch (error) {
                    console.error("❌ Image upload error:", error);
                    alert(
                         "There was an error uploading the image. Please try again.",
                    );
               } finally {
                    setUploading(false);
               }
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (
               !formData.title ||
               !formData.date ||
               !formData.time ||
               !formData.location ||
               !formData.description
          ) {
               alert("Please fill in all required fields.");
               return;
          }

          if (!formData.imageUrl) {
               alert(
                    "Please wait for the image to finish uploading before submitting.",
               );
               return;
          }

          // Send notifications to invited emails (Firebase-safe key)
          await Promise.all(inviteEmails.map(async (email) => {
               const uid = await getUidFromEmail(email);
               const notificationRef = ref(getDatabase(), `notifications/${uid}`);
               const newNotificationRef = push(notificationRef);
               const timestamp = Date.now();
               await set(newNotificationRef, {
                    id: newNotificationRef.key,
                    eventId: `_v_${formData.title.toLowerCase().replace(/\s+/g, "_")}_${new Date().getFullYear()}`,
                    eventTitle: formData.title.trim(),
                    read: false,
                    type: "rsvp",
                    text: `Admin RSVP'd to ${formData.title.trim()}.`,
                    timestamp,
               });
          }));

          // Pass only dateTime, not separate date and time
          onSave({
               ...formData,
               id: Date.now(),
               attendees: 0,
               status: "upcoming",
               dateTime: Timestamp.fromDate(
                    new Date(`${formData.date}T${formData.time}`),
               ),
          });
     };

     return (
          <main className="main-content" style={{ maxWidth: "678px" }}>
               <div className="section-header" style={{marginTop: 28}}>
                    <h1

                         className="section-title page-title"
                    >
                         Create New Event
                    </h1>
                    <button
                         className="btn btn-outline"
                         onClick={onCancel}
                    >
                         <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                         >
                              <path
                                   fillRule="evenodd"
                                   d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                              />
                         </svg>
                         Back to Dashboard
                    </button>
               </div>
               <div className="card card-padded">
                    <form onSubmit={handleSubmit} className="form">
                         <div className="form-group">
                              <label className="form-label" htmlFor="title">
                                   Event Title
                              </label>
                              <input
                                   className="form-input"
                                   type="text"
                                   id="title"
                                   name="title"
                                   value={formData.title}
                                   onChange={handleChange}
                                   placeholder="e.g., Summer Music Festival"
                                   required
                              />
                         </div>
                         <div className="form-row">
                              <div className="form-group">
                                   <label className="form-label" htmlFor="date">
                                        Date
                                   </label>
                                   <input
                                        className="form-input"
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="form-group">
                                   <label className="form-label" htmlFor="time">
                                        Time
                                   </label>
                                   <input
                                        className="form-input"
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                         </div>
                         <div className="form-group">
                              <label className="form-label" htmlFor="location">
                                   Location
                              </label>
                              <input
                                   className="form-input"
                                   type="text"
                                   id="location"
                                   name="location"
                                   value={formData.location}
                                   onChange={handleChange}
                                   placeholder="e.g., Hyde Park, London"
                                   required
                              />
                         </div>
                         <div className="form-group">
                              <label className="form-label">Event Image</label>
                              <input
                                   type="file"
                                   id="image-upload-create"
                                   accept="image/*"
                                   onChange={handleImageChange}
                                   className="hidden"
                              />
                              <label
                                   htmlFor="image-upload-create"
                                   className="image-upload"
                              >
                                   {uploading ? (
                                        "Uploading image..."
                                   ) : (
                                        <>
                                             Click to upload image{" "}
                                             <span
                                                  style={{
                                                       fontSize: "0.62rem",
                                                       color: "#999",
                                                  }}
                                             >
                                                  {" "}
                                                  Suggested aspect ratio 2:1{" "}
                                             </span>
                                        </>
                                   )}
                              </label>
                              {imagePreview && (
                                   <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="image-preview"
                                        style={{
                                             maxWidth: 360,
                                             maxHeight: 360,
                                             display: "block",
                                             margin: "30px auto 0",
                                        }}
                                   />
                              )}
                         </div>
                         <div className="form-group">
                              <label className="form-label" htmlFor="description">
                                   Description
                              </label>
                              <textarea
                                   className="form-textarea"
                                   id="description"
                                   name="description"
                                   value={formData.description}
                                   onChange={handleChange}
                                   placeholder="Describe your event..."
                                   required
                              />
                         </div>

                         <div className="form-group">
                              <label className="form-label" htmlFor="inviteEmails">Invite Users</label>
                              <input
                                   className="form-input"
                                   type="text"
                                   id="inviteEmails"
                                   name="inviteEmails"
                                   value={emailInput}
                                   onChange={handleEmailChange}
                                   onBlur={handleEmailBlur}
                                   placeholder="e.g., user_1@mail.com, user_2@mail.com"
                              />
                         </div>


                         <div
                              className="modal-footer"
                              style={{
                                   padding: 0,
                                   borderTop: "1px solid var(--border-color)",
                                   paddingTop: "20px",
                              }}
                         >
                              <button
                                   type="button"
                                   className="btn btn-outline"
                                   onClick={onCancel}
                              >
                                   Cancel
                              </button>
                              <button type="submit" className="btn btn-primary">
                                   Create Event
                              </button>
                         </div>
                    </form>
               </div>
          </main >
     );
};
