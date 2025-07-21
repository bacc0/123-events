import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     IconButton,
     Box,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";

import React, { useState, useEffect } from "react";
import {
     ref as dbRef,
     set as dbSet,
     onValue,
     get,
     update as dbUpdate,
} from "firebase/database";
import { database } from "../firebase";
import Progress from "./Progress"


import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


const Modal_Edit_Profile = ({ userId = "", refreshUser = () => { } }) => {

     // State for controlling the modal open/close
     const [open, setOpen] = useState(false);

     // State to hold the user's data
     const [userData, setUserData] = useState({});


     const [imageFile, setImageFile] = useState(null);
     const [imagePreview, setImagePreview] = useState(userData.profileImageUrl || "");

     // This effect runs when the component mounts or when userId changes
     // It fetches the user's data from the Firebase Realtime Database 
     useEffect(() => {
          if (!userId) return;

          const userRef = dbRef(database, "users/" + userId);
          const unsubscribe = onValue(userRef, (snapshot) => {
               const data = snapshot.val();
               if (data) {
                    setUserData(data);
                    console.log("Fetched userData:", data);
               }
          });

          // Clean up the listener when the component unmounts
          return () => unsubscribe();
     }, [userId]);

     // This function updates the userData state when input fields change
     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setUserData((prev) => ({
               ...prev,
               [name]: value,
          }));
          console.log(`${name} changed to:`, value);
     };

     // This function updates the user's data in Firebase
     // It also updates the user's full name in all events they have created
     const handleUpdate = async () => {
          if (!userId) return;

          try {
               const updatedData = { ...userData };

               const userRef = dbRef(database, "users/" + userId);
               await dbSet(userRef, updatedData);
               console.log("✅ User profile updated");

               // Update organizer name in all events
               const eventsSnapshot = await get(dbRef(database, "events"));
               if (eventsSnapshot.exists()) {
                    const events = eventsSnapshot.val();
                    const updates = {};

                    Object.entries(events).forEach(([eventId, eventData]) => {
                         if (eventData.organizer?.uid === userId) {
                              updates[`events/${eventId}/organizer/fullName`] = updatedData.fullName;
                         }
                    });

                    if (Object.keys(updates).length > 0) {
                         await dbUpdate(dbRef(database), updates);
                         console.log("✅ Events updated with new full name");
                    }
               }

               refreshUser();

               setImagePreview("");

               setOpen(false);
          } catch (error) {
               console.error("❌ Error updating profile:", error);
               alert("Failed to update profile.");
          }
     };

     return (
          <Box style={{ borderRadius: 16 }}>
               <Button
                    variant="contained"
                    onClick={() => {
                         console.log("Edit Profile button clicked");
                         setOpen(true);
                    }}
                    style={{
                         borderRadius: 8,
                         background: "#0A47A3",
                         width: 210
                    }}
                    endIcon={<BuildIcon />}
               >
                    Edit Profile
               </Button>

               <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                         style: {
                              borderRadius: 16,
                         },
                    }}
               >
                    <DialogTitle>
                         <IconButton
                              aria-label="close"
                              onClick={() => setOpen(false)}
                              sx={{ position: "absolute", right: 8, top: 8 }}
                         >
                              <CloseIcon />
                         </IconButton>
                    </DialogTitle>

                    <DialogContent>
                         <div style={{ display: "flex", justifyContent: "center" }}>
                              <div>
                                   {/* <div style={{ display: "flex", justifyContent: "center" }}>
                                        <img
                                             src="/appLogoEvents.svg"
                                             alt="App Logo"
                                             width="54"
                                             height="54"
                                        />
                                   </div> */}
                                   <h1
                                        style={{
                                             textAlign: "center",
                                             fontSize: '1.5rem',
                                             fontWeight: 600,
                                             color: '#455a64',
                                             marginBottom: 35
                                        }}
                                   >
                                        Update Account

                                   </h1>

                                   <label
                                        htmlFor="fullName"
                                        style={{ fontSize: 14, color: "#78909C" }}
                                   >
                                        Full Name
                                   </label>
                                   <br />
                                   <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        required
                                        value={userData.fullName || ""}
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

                                   <label
                                        htmlFor="about"
                                        style={{
                                             fontSize: 14,
                                             color: "#78909C",

                                        }}
                                   >
                                        About
                                   </label>
                                   <br />
                                   <textarea
                                        id="about"
                                        name="about"
                                        placeholder="Tell us about yourself..."
                                        autoComplete="off"
                                        required
                                        value={userData.about || ""}
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
                                             lineHeight: "1.42"
                                        }}
                                   />

                                   {/* <div className="form-group">
                                        <label
                                             className="form-label"
                                             style={{
                                                  fontSize: 14,
                                                  color: "#78909C",
                                                  marginBottom: 4,
                                                  fontWeight: 400,
                                             }}
                                        >
                                             Event Image
                                        </label>
                                        <input
                                             type="file"
                                             id="image-upload-create"
                                             accept="image/*"
                                             className="hidden"
                                        />
                                        <label
                                             htmlFor="image-upload-create"
                                             className="image-upload"
                                        >
                                             <>
                                                  Click to upload image{" "}
                                                  <span
                                                       style={{
                                                            fontSize: "0.62rem",
                                                            color: "#b0bec5",
                                                       }}
                                                  >
                                                       Suggested aspect ratio 2:1
                                                  </span>
                                             </>
                                        </label>
                                   </div> */}




                                   <div
                                   // className="form-group"
                                   >

                                        <label
                                             className="image-upload"
                                             className="form-label"
                                             style={{
                                                  fontSize: 14,
                                                  color: "#78909C",
                                                  marginBottom: 4,
                                                  // paddingBottom: 10,
                                                  fontWeight: 400,

                                                  // borderBottom: '0.1px solid #b0bec5'
                                             }}
                                        >
                                             Profile Image
                                             <span
                                                  style={{
                                                       fontSize: "0.62rem",
                                                       color: "#b0bec5",
                                                       marginLeft: 10
                                                  }}
                                             >
                                                  Suggested Aspect Ratio 1:1
                                             </span>
                                        </label>
                                        <div
                                             style={{
                                                  border: '1px dotted #cfd8dc',
                                             }}
                                             className="form-group-upload"
                                        >
                                             <input
                                                  style={{
                                                       position: ' relative',
                                                       left: 11,
                                                       color: '#90a4ae',
                                                       // background: 'red'
                                                       cursor: 'pointer'

                                                  }}


                                                  type="file"
                                                  accept="image/*"
                                                  onChange={async (e) => {
                                                       const file = e.target.files[0];
                                                       if (!file) return;

                                                       setImageFile(file);
                                                       const reader = new FileReader();
                                                       reader.onloadend = () => setImagePreview(reader.result);
                                                       reader.readAsDataURL(file);

                                                       // Upload image immediately
                                                       try {
                                                            const storage = getStorage();
                                                            const imageRef = storageRef(storage, `profile_images/${Date.now()}_${file.name}`);
                                                            await uploadBytes(imageRef, file);
                                                            const url = await getDownloadURL(imageRef);
                                                            console.log("✅ Image uploaded and URL set:", url);

                                                            setUserData((prev) => ({ ...prev, profileImageUrl: url }));
                                                       } catch (err) {
                                                            console.error("❌ Failed to upload image:", err);
                                                            alert("Image upload failed. Please try again.");
                                                       }
                                                  }}
                                             />

                                        </div>



                                        {imagePreview && (
                                             <>
                                                  <div style={{ textAlign: 'center', marginTop: 20 }}  >
                                                       <Progress />
                                                  </div>
                                                  <div
                                                       style={{
                                                            display: 'flex',
                                                            justifyContent: 'center'
                                                       }}
                                                  >
                                                       <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            style={{
                                                                 maxHeight: "100px",
                                                                 maxWidth: "100px",
                                                                 marginTop: "10px",
                                                                 borderRadius: 16
                                                            }}
                                                       />
                                                  </div>
                                             </>
                                        )}
                                   </div>

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
                                             className="signup-button"
                                             endIcon={<UpdateIcon />}
                                        >
                                             <span>UPDATE ACCOUNT</span>
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </DialogContent>

                    <DialogActions></DialogActions>
               </Dialog>
          </Box>
     );
};

export default Modal_Edit_Profile;
