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


export default function MenuAppBar({ isLoggedIn, onToggleLogin }) {
     const navigate = useNavigate();
     const [fullName, setFullName] = React.useState('');

     React.useEffect(() => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
               const db = getDatabase();
               const userRef = ref(db, 'users/' + user.uid);
               onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data && data.fullName) {
                         setFullName(data.fullName);
                    }
               });
          }
     }, []);
     return (
          <Box sx={{ flexGrow: 1 }}>
               <AppBar
                    position="fixed" // ← always on top
                    color="default"
                    elevation={0}
                    sx={{

                         backgroundColor: isLoggedIn ? '#ffffffbb' : '#ffffff00', // semi-transparent background
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
                         <Box
                              sx={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   width: '40%',
                              }}
                         >
                              {isLoggedIn && (
                                   <IconButton onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')} sx={{ p: 0 }}>
                                        <div
                                             style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '8px',
                                                  whiteSpace: 'nowrap',
                                                  // backgroundColor: '#0D47A1',
                                                  padding: 4,
                                                  borderRadius: 6,
                                                  position: 'relative',
                                                  top: -2
                                             }}
                                        >
                                             <img src="/appLogoEvents.svg" alt="App Logo" width="50" height="50" />


                                        </div>
                                   </IconButton>
                              )}
                              {isLoggedIn && (
                                   <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 'bold', fontSize: '.9rem', whiteSpace: 'nowrap', ml: 0 }}
                                   >
                                        {/* Event Manager */}
                                   </Typography>
                              )}
                         </Box>

                         {/* Middle container */}
                         {/* <Box
                              sx={{
                                   display: 'flex',
                                   justifyContent: 'center',
                                   width: '20%',
                              }}
                         >
                              {isLoggedIn &&
                                   <IconButton color="inherit">
                                        <Badge color="error" variant="dot">
                                             <NotificationsIcon />
                                        </Badge>
                                   </IconButton>
                              }
                         </Box> */}

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
                                   {isLoggedIn &&
                                        <>
                                             <IconButton color="inherit">
                                                  <Badge
                                                       badgeContent={3}
                                                       sx={{
                                                            '& .MuiBadge-badge': {
                                                                 backgroundColor: pink.A200,
                                                                 color: 'white',
                                                            }
                                                       }}
                                                  >
                                                       <NotificationsIcon />
                                                  </Badge>
                                             </IconButton>

                                             <IconButton 
                                             style={{ marginRight: -3, marginLeft: 2 }}
                                             color="inherit"
                                             >
                                                  <PersonIcon />
                                             </IconButton>
                                        </>
                                   }
                              </Box>

                              <Box
                                   sx={{
                                        maxWidth: 78,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        scrollbarWidth: 'none', // For Firefox
                                        '&::-webkit-scrollbar': {
                                             display: 'none', // For Chrome, Safari
                                        }
                                   }}
                                   style={{
                                        background: 'linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(217, 217, 217, 0.4) 100%)',

                                        position: 'relative', top: 1.2,


                                   }}
                              >
                                   {isLoggedIn &&
                                        <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                                             {fullName || getAuth().currentUser?.email || 'User'}
                                        </Typography>
                                   }
                              </Box>
                              <Box
                                   sx={{
                                        maxWidth: 100,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        mx: 0,
                                        // paddingRight: 1,
                                        paddingLeft: 1, paddingTop: '2px',
                                   }}
                              >
                                   <IconButton
                                        variant="outlined"
                                        // color="inherit"
                                        // onClick={onToggleLogin}
                                        onClick={() => {
                                             const auth = getAuth();
                                             signOut(auth)
                                                  .then(() => {
                                                       window.location.href = '/'; // Redirect immediately
                                                  })
                                                  .catch((error) => {
                                                       console.error('Logout error:', error);
                                                  });
                                        }}
                                        sx={{
                                             // ml: 1,
                                             height: 40,
                                             width: 40,
                                             // color: 'primary.main',
                                             // borderColor: 'primary.main',
                                             // px: 3,
                                             // minWidth: '120px',
                                             // background: '#ffffff',

                                        }}
                                   >
                                        {isLoggedIn
                                             ? <div>
                                                  <div
                                                       style={{
                                                            fontSize: 5.4,
                                                            position: 'relative', top: -2
                                                       }}
                                                  >
                                                       LOGOUT
                                                  </div>
                                                  <div
                                                       style={{ position: 'relative', top: -1, left: 5.4 }}
                                                  >
                                                       <LogoutIcon sx={{ mr: 1 }} />
                                                  </div>
                                             </div>
                                             : null
                                             // <LoginIcon sx={{ mr: 1 }} />
                                        }
                                        {/* {isLoggedIn && <LogoutIcon sx={{ mr: 1 }} />} */}
                                        <div />
                                   </IconButton>
                              </Box>

                         </Box>
                    </Toolbar>
               </AppBar>
               {/* Padding box to push content below the AppBar */}
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
