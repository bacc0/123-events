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

const Modal_Edit_Profile = ({ userId = "", refreshUser = () => { } }) => {

     // State for controlling the modal open/close
     const [open, setOpen] = useState(false);

     // State to hold the user's data
     const [userData, setUserData] = useState({});

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

          const userRef = dbRef(database, "users/" + userId);

          try {
               // 1. Update user profile in /users
               await dbSet(userRef, userData);
               console.log("User data fully updated");

               // 2. Get all events and find the ones created by this user
               const eventsSnapshot = await get(dbRef(database, "events"));
               if (eventsSnapshot.exists()) {
                    const events = eventsSnapshot.val();
                    const updates = {};

                    Object.entries(events).forEach(([eventId, eventData]) => {
                         if (eventData.organizer?.uid === userId) {
                              updates[`events/${eventId}/organizer/fullName`] = userData.fullName;
                         }
                    });

                    if (Object.keys(updates).length > 0) {
                         await dbUpdate(dbRef(database), updates);
                         console.log("Organizer name updated in events");
                    }
               }

               refreshUser(); // Optional callback to refresh user info in the UI
               setOpen(false); // close modal
          } catch (error) {
               console.error("Error updating user info:", error);
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
                                   <div style={{ display: "flex", justifyContent: "center" }}>
                                        <img
                                             src="/appLogoEvents.svg"
                                             alt="App Logo"
                                             width="54"
                                             height="54"
                                        />
                                   </div>
                                   <h1 style={{ textAlign: "center" }}>Update Account</h1>

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
                                             width: 330,
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
                                        style={{ fontSize: 14, color: "#78909C" }}
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
                                             width: 330,
                                             height: 97,
                                             border: "1px solid #CFD8DD",
                                             padding: 20,
                                             marginTop: 12,
                                             marginBottom: 17,
                                             fontSize: 14,
                                        }}
                                   />

                                   <div className="form-group">
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
                                   </div>

                                   <div style={{ textAlign: "right" }}>
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
