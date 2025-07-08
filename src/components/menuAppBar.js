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

export default function MenuAppBar({ isLoggedIn, onToggleLogin }) {
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
                                   // justifyContent: 'flex-end',
                                   alignItems: 'center',
                                   width: '40%',
                              }}
                         >
                              {isLoggedIn &&
                                   // <IconButton color="primary" sx={{ mr: 1 }}>
                                   //      <EventNote />
                                   // </IconButton>
                                   <div
                                        style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             gap: '8px',
                                             whiteSpace: 'nowrap',
                                             backgroundColor: '#0D47A1',
                                             padding: 4,
                                             borderRadius: 6
                                        }}>
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <rect x="4" y="8" width="28" height="24" rx="3" stroke="white" strokeWidth="2" fill="none" />
                                             <rect x="4" y="8" width="28" height="8" fill="white" opacity="0.3" />
                                             <line x1="10" y1="4" x2="10" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                             <line x1="26" y1="4" x2="26" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                             <circle cx="12" cy="22" r="2" fill="white" />
                                             <circle cx="18" cy="22" r="2" fill="white" />
                                             <circle cx="24" cy="22" r="2" fill="white" />
                                             <circle cx="12" cy="27" r="2" fill="white" opacity="0.6" />
                                             <circle cx="18" cy="27" r="2" fill="white" opacity="0.6" />
                                        </svg>
                                   </div>
                              }
                              {isLoggedIn &&

                                   <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 'bold', fontSize: '.9rem', whiteSpace: 'nowrap', ml: 0 }}
                                   >
                                        {/* Event Manager */}
                                   </Typography>
                              }
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
          </Box>
     );
}
