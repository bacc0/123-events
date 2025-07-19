import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import EventNote from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { pink } from '@mui/material/colors';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from 'firebase/database';
import { motion } from "framer-motion";

export default function MenuAppBar({ isLoggedIn, onToggleLogin }) {
     const navigate = useNavigate();
     const [fullName, setFullName] = React.useState('');
     const [profileImageUrl, setProfileImageUrl] = React.useState('');
     const [showAvatar, setShowAvatar] = React.useState(false); // ⬅️ new

     React.useEffect(() => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
               const db = getDatabase();
               const userRef = ref(db, 'users/' + user.uid);
               onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                         if (data.fullName) setFullName(data.fullName);
                         if (data.profileImageUrl) {
                              setProfileImageUrl(data.profileImageUrl);
                              setShowAvatar(false); // reset
                              setTimeout(() => setShowAvatar(true), 5000); // ⬅️ delay
                         }
                    }
               });
          }
     }, []);

     return (
          <Box sx={{ flexGrow: 1 }}>
               <AppBar
                    position="fixed"
                    color="default"
                    elevation={0}
                    sx={{
                         backgroundColor: isLoggedIn ? '#ffffffbb' : '#ffffff00',
                         backdropFilter: isLoggedIn ? 'blur(6px)' : 'blur(0px)',
                         WebkitBackdropFilter: isLoggedIn ? 'blur(16px)' : 'blur(0px)',
                    }}
               >
                    <Toolbar
                         sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                         }}
                    >
                         {/* Left container */}
                         <Box sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                              {isLoggedIn && (
                                   <IconButton onClick={() => navigate('/dashboard')} sx={{ p: 0 }}>
                                        <motion.div
                                             initial={{ y: -100, opacity: 0 }}
                                             animate={{ y: 0, opacity: 1 }}
                                             transition={{ duration: 1, delay: 1.3 }}
                                             style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '8px',
                                                  whiteSpace: 'nowrap',
                                                  padding: 4,
                                                  borderRadius: 6,
                                                  position: 'relative',
                                                  top: -2
                                             }}
                                        >
                                             <img src="/appLogoEvents.svg" alt="App Logo" width="50" height="50" />
                                        </motion.div>
                                   </IconButton>
                              )}
                         </Box>

                         {/* Right container */}
                         <Box
                              sx={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'flex-end',
                                   width: '80%',
                                   overflow: 'hidden',
                              }}
                         >
                              <Box
                                   sx={{
                                        maxWidth: 100,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        mx: 1,
                                        color: '#757575',
                                        paddingRight: '2px',
                                        paddingLeft: 1,
                                        paddingTop: '2px',
                                   }}
                              >
                                   {isLoggedIn && (
                                        <>
                                             <IconButton color="inherit">
                                                  <NotificationsIcon />
                                                  <motion.div
                                                       initial={{ y: -16, opacity: 0, scale: 5 }}
                                                       animate={{ y: -16, opacity: 1, scale: 1 }}
                                                       transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 20,
                                                            delay: 0.6
                                                       }}
                                                  >
                                                       <Badge
                                                            badgeContent={3}
                                                            sx={{
                                                                 '& .MuiBadge-badge': {
                                                                      backgroundColor: pink.A200,
                                                                      color: 'white',
                                                                 }
                                                            }}
                                                       />
                                                  </motion.div>
                                             </IconButton>

                                             {/* Avatar with 5s delay */}
                                             <IconButton style={{ marginRight: -3, marginLeft: 2 }} color="inherit">
                                                  {profileImageUrl && showAvatar ? (
                                                       <div
                                                            style={{
                                                                 width: 25,
                                                                 height: 25,
                                                                 borderRadius: '50%',
                                                                 backgroundColor: '#F8F9FA',
                                                                 // margin: '0 auto 36px',
                                                                 backgroundImage: `url(${process.env.PUBLIC_URL}/userIMG.png)`,
                                                                 backgroundSize: 'cover',
                                                                 backgroundPosition: 'center',
                                                                 backgroundRepeat: 'no-repeat',
                                                            }}
                                                       >
                                                            <Box sx={{
                                                                 width: 25,
                                                                 height: 25,
                                                                 borderRadius: '50%',
                                                                 overflow: 'hidden'
                                                            }}>
                                                                 <motion.img
                                                                      initial={{ opacity: 0, filter: "blur(8px)" }}
                                                                      animate={{ opacity: 1, filter: "blur(0px)" }}
                                                                      transition={{ duration: 1.2 }}
                                                                      src={profileImageUrl}
                                                                      alt={fullName}
                                                                      style={{
                                                                           width: '100%',
                                                                           height: '100%',
                                                                           objectFit: 'cover'
                                                                      }}
                                                                 />
                                                            </Box>
                                                       </div>
                                                  ) : (
                                                       <div style={{
                                                            width: 25,
                                                            height: 25,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#F3F5F7',
                                                            // margin: '0 auto 36px',
                                                            backgroundImage: `url(${process.env.PUBLIC_URL}/userIMG.png)`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat',
                                                       }}
                                                       />
                                                  )}
                                             </IconButton>
                                        </>
                                   )}
                              </Box>

                              <Box
                                   sx={{
                                        maxWidth: 78,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        scrollbarWidth: 'none',
                                        '&::-webkit-scrollbar': { display: 'none' }
                                   }}
                                   style={{
                                        background: 'linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(217, 217, 217, 0.2) 100%)',
                                        position: 'relative', top: 1.2,
                                   }}
                              >
                                   {isLoggedIn && (
                                        <motion.div
                                             initial={{ x: 90 }}
                                             animate={{ x: 0 }}
                                             transition={{ duration: 1.6, delay: 0.7 }}
                                        >
                                             <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                                                  {fullName || getAuth().currentUser?.email || 'User'}
                                             </Typography>
                                        </motion.div>
                                   )}
                              </Box>

                              <Box
                                   sx={{
                                        maxWidth: 100,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        mx: 0,
                                        paddingLeft: 1,
                                        paddingTop: '2px',
                                   }}
                              >
                                   <IconButton
                                        variant="outlined"
                                        onClick={() => {
                                             const auth = getAuth();
                                             signOut(auth)
                                                  .then(() => { window.location.href = '/'; })
                                                  .catch((error) => { console.error('Logout error:', error); });
                                        }}
                                        sx={{ height: 40, width: 40 }}
                                   >
                                        {isLoggedIn ? (
                                             <div>
                                                  <div style={{ fontSize: 5.4, position: 'relative', top: -2 }}>
                                                       LOGOUT
                                                  </div>
                                                  <div style={{ position: 'relative', top: -1, left: 5.4 }}>
                                                       <LogoutIcon sx={{ mr: 1 }} />
                                                  </div>
                                             </div>
                                        ) : null}
                                   </IconButton>
                              </Box>
                         </Box>
                    </Toolbar>
               </AppBar>

               <Toolbar />

               {/* {isLoggedIn && (
                    <Box
                         sx={{
                              backgroundColor: "#EBF4FFdd",
                              color: "#0D47A1",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontFamily: "Arial, sans-serif",
                              border: "0.3px solid #0D47A1",
                              borderRadius: "16px",
                              margin: "0 auto 10px auto",
                              maxWidth: "80%",
                              fontSize: "15px",
                              position: "fixed",
                              top: 16,
                              left: 0,
                              right: 0,
                              zIndex: 1111,
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              textAlignLast: "center",
                              boxShadow: "0 0 26px #00000033",
                         }}
                    >
                         <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}> Live Event Updates:</p>
                         <ul style={{ paddingLeft: "20px", margin: 0 }}>
                              <h5>🎉 New Event: “React Workshop” added</h5>
                              <h5>🎨 New Event: “Design Meetup” added</h5>
                              <h5>🚀 New Event: “Startup Pitch Night” added</h5>
                         </ul>
                    </Box>
               )} */}
          </Box>
     );
}
