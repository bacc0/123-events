import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import EventNote from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';

export default function MenuAppBar({ isLoggedIn, onToggleLogin }) {
     const navigate = useNavigate();
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
                                             }}
                                        >
                                             <img src="/appLogoEvents.svg" alt="App Logo" width="52" height="52" />


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
                                   width: '40%',
                                   overflow: 'hidden',
                              }}
                         >
                              <Box
                                   sx={{
                                        maxWidth: 100,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        mx: 1,
                                   }}
                              >
                                   {isLoggedIn &&
                                        <IconButton color="inherit">
                                             <Badge color="error" variant="dot">
                                                  <NotificationsIcon />
                                             </Badge>
                                        </IconButton>
                                   }
                              </Box>
                              <Box
                                   sx={{
                                        maxWidth: 100,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        mx: 1,
                                   }}
                              >
                                   {isLoggedIn &&
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                             JohnathonSuperLongNameThatScrolls
                                        </Typography>
                                   }
                              </Box>

                              <Button
                                   variant="outlined"
                                   // color="inherit"
                                   onClick={onToggleLogin}
                                   sx={{
                                        ml: 1,
                                        height: 40,
                                        // color: 'primary.main',
                                        borderColor: 'primary.main',
                                        px: 3,
                                        minWidth: '120px',
                                        background: '#ffffff',
                                   }}
                              >
                                   {isLoggedIn ? 'Logout' : 'Login'}
                              </Button>
                         </Box>
                    </Toolbar>
               </AppBar>
               {/* Padding box to push content below the AppBar */}
               <Toolbar />
               {/* {!isLoggedIn && (
                    <Box
                         sx={{
                              backgroundColor: "#EBF4FFdd",
                              color: "#0D47A1",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontFamily: "Arial, sans-serif",
                              border: "2px solid #0D47A1",
                              borderRadius: "16px",
                              margin: "0 auto 10px auto",
                              maxWidth: "80%",
                              fontSize: "15px",
                              position: "fixed",
                              top: 16,
                              left: 0,
                              right: 0,
                              zIndex: 1111,
                              backdropFilter: 'blur(6px)',
                              WebkitBackdropFilter: 'blur(6px)',
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
