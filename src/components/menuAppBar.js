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
                    
                         backgroundColor: isLoggedIn ?  '#ffffffbb' : '#ffffff00', // semi-transparent background
                         backdropFilter:  isLoggedIn ? 'blur(6px)': 'blur(0px)',
                         WebkitBackdropFilter: isLoggedIn ? 'blur(16px)': 'blur(0px)',
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
                              <IconButton color="primary" sx={{ mr: 1 }}>
                                   <EventNote />
                              </IconButton>
                              <Typography
                                   variant="subtitle2"
                                   sx={{ fontWeight: 'bold', fontSize: '.9rem', whiteSpace: 'nowrap', ml: 0 }}
                              >
                                   Event Manager
                              </Typography>
                         </Box>

                         {/* Middle container */}
                         <Box
                              sx={{
                                   display: 'flex',
                                   justifyContent: 'center',
                                   width: '20%',
                              }}
                         >
                              <IconButton color="inherit"> 
                                   <Badge color="error" variant="dot">
                                        <NotificationsIcon />
                                   </Badge>
                              </IconButton>
                         </Box>

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
                                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        JohnathonSuperLongNameThatScrolls
                                   </Typography>
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
                                        background:  '#ffffff',
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
