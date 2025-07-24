import React, { useState, useEffect } from "react";
import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";
import { getDatabase, ref as dbRef, get, update } from "firebase/database";
import {
     getStorage,
     ref as storageRef,
     uploadBytes,
     getDownloadURL,
} from "firebase/storage";
import Progress from "./___Site_Base/_Progress";

const Modal_Edit_Event = ({
     eventId = "",
     open = false,
     onClose = () => { },
     refreshEvents = () => { },
}) => {
     const [eventData, setEventData] = useState({});
     const [imagePreview, setImagePreview] = useState("");

     useEffect(() => {
          if (!eventId) return;

          const fetchEvent = async () => {
               const db = getDatabase();
               const eventRef = dbRef(db, "events/" + eventId);
               const snapshot = await get(eventRef);
               if (snapshot.exists()) {
                    const data = snapshot.val();
                    setEventData({
                         ...data,
                         dateTime: data.dateTime?.seconds
                              ? new Date(data.dateTime.seconds * 1000)
                                   .toISOString()
                                   .slice(0, 16)
                              : "",
                    });
                    setImagePreview("");
               }
          };

          fetchEvent();
     }, [eventId]);

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setEventData((prev) => ({ ...prev, [name]: value }));
     };

     const handleImageUpload = async (file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
               setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);

          const storage = getStorage();
          const imageRef = storageRef(storage, `event_images/${Date.now()}_${file.name}`);
          await uploadBytes(imageRef, file);
          const url = await getDownloadURL(imageRef);
          setEventData((prev) => ({ ...prev, imageUrl: url }));
     };

     const handleUpdate = async () => {
          try {
               const db = getDatabase();
               const eventRef = dbRef(db, "events/" + eventId);

               const updatedData = {
                    ...eventData,
                    dateTime: {
                         seconds: Math.floor(new Date(eventData.dateTime).getTime() / 1000),
                         nanoseconds: 0,
                    },
               };

               await update(eventRef, updatedData);
               console.log("✅ Event updated");

               refreshEvents();
               setImagePreview("");
               onClose();
          } catch (error) {
               console.error("❌ Failed to update event:", error);
               alert("Failed to update event.");
          }
     };

     return (
          <Dialog
               open={open}
               onClose={onClose}
               fullWidth
               maxWidth="sm"
               PaperProps={{ style: { borderRadius: 16 } }}
          >
               <DialogTitle>
                    <IconButton
                         aria-label="close"
                         onClick={onClose}
                         sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                         <CloseIcon />
                    </IconButton>
               </DialogTitle>

               <DialogContent>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                         <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div style={{ width: 280 }}>
                                   <h1
                                        style={{
                                             textAlign: "center",
                                             fontSize: "1.5rem",
                                             fontWeight: 600,
                                             color: "#455a64",
                                             marginBottom: 35,

                                        }}
                                   >
                                        Update Event
                                   </h1>

                                   <label style={{ fontSize: 14, color: "#78909C" }}>Title</label>
                                   <br />
                                   <input
                                        type="text"
                                        name="title"
                                        value={eventData.title || ""}
                                        onChange={handleInputChange}
                                        style={{
                                             borderRadius: 16,
                                             width: 280,
                                             height: 30,
                                             border: "1px solid #CFD8DD",
                                             padding: "12px 20px",
                                             marginTop: 12,
                                             fontSize: 14,
                                        }}
                                   />
                                   <br />
                                   <br />

                                   <label style={{ fontSize: 14, color: "#78909C" }}>Location</label>
                                   <br />
                                   <input
                                        type="text"
                                        name="location"
                                        value={eventData.location || ""}
                                        onChange={handleInputChange}
                                        style={{
                                             borderRadius: 16,
                                             width: 280,
                                             height: 30,
                                             border: "1px solid #CFD8DD",
                                             padding: "12px 20px",
                                             marginTop: 12,
                                             fontSize: 14,
                                        }}
                                   />
                                   <br />
                                   <br />

                                   <label style={{ fontSize: 14, color: "#78909C" }}>Date & Time</label>
                                   <br />
                                   <input
                                        type="datetime-local"
                                        name="dateTime"
                                        value={eventData.dateTime || ""}
                                        onChange={handleInputChange}
                                        style={{
                                             borderRadius: 16,
                                             width: 280,
                                             height: 30,
                                             border: "1px solid #CFD8DD",
                                             padding: "12px 20px",
                                             marginTop: 12,
                                             fontSize: 14,
                                        }}
                                   />
                                   <br />
                                   <br />

                                   <label style={{ fontSize: 14, color: "#78909C" }}>Description</label>
                                   <br />
                                   <textarea
                                        name="description"
                                        value={eventData.description || ""}
                                        onChange={handleInputChange}
                                        style={{
                                             borderRadius: 16,
                                             width: 280,
                                             height: 97,
                                             border: "1px solid #CFD8DD",
                                             padding: 20,
                                             marginTop: 12,
                                             marginBottom: 17,
                                             fontSize: 14,
                                             lineHeight: "1.42",
                                        }}
                                   />

                                   <label
                                        style={{
                                             fontSize: 14,
                                             color: "#78909C",
                                             marginBottom: 4,
                                             fontWeight: 400,
                                        }}
                                   >
                                        Event Image
                                        <span
                                             style={{
                                                  fontSize: "0.62rem",
                                                  color: "#b0bec5",
                                                  marginLeft: 10,
                                             }}
                                        >
                                             Suggested Aspect Ratio 2:1
                                        </span>
                                   </label>

                                   <div style={{ border: "1px dotted #cfd8dc" }} className="form-group-upload">
                                        <input
                                             type="file"
                                             accept="image/*"
                                             style={{
                                                  position: "relative",
                                                  left: 11,
                                                  color: "#90a4ae",
                                                  cursor: "pointer",
                                             }}
                                             onChange={async (e) => {
                                                  const file = e.target.files[0];
                                                  if (!file) return;
                                                  await handleImageUpload(file);
                                             }}
                                        />
                                   </div>

                                   {imagePreview && (
                                        <>
                                             <div style={{ textAlign: "center", marginTop: 20 }}>
                                                  <Progress />
                                             </div>
                                             <div style={{ display: "flex", justifyContent: "center" }}>
                                                  <img
                                                       src={imagePreview}
                                                       alt="Preview"
                                                       style={{
                                                            maxHeight: "100px",
                                                            maxWidth: "100px",
                                                            marginTop: "10px",
                                                            borderRadius: 16,
                                                       }}
                                                  />
                                             </div>
                                        </>
                                   )}

                                   <div style={{ textAlign: "center" }}>
                                        <Button
                                             onClick={handleUpdate}
                                             style={{
                                                  borderRadius: 8,
                                                  background: "#0A47A3",
                                                  color: "#ffffff",
                                                  height: 35,
                                                  minWidth: 190,
                                                  marginBottom: 12,
                                                  marginTop: 48,
                                             }}
                                             endIcon={<UpdateIcon />}
                                        >
                                             <span>UPDATE EVENT</span>
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </DialogContent>

               <DialogActions />
          </Dialog>
     );
};

export default Modal_Edit_Event;