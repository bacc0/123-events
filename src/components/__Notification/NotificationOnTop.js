import React from 'react';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import GroupIcon from '@mui/icons-material/Group';
import { motion, AnimatePresence } from 'framer-motion';


const NotificationOnTop = ({ notifications }) => {


     const filteredNotifications = [...new Set(notifications)];



     // console.log("Original Notifications:", notifications);
     // console.log("Filtered Notifications:", filteredNotifications);



     const getNotificationIcon = (type) => {
          switch (type) {
               case 'rsvp_cancelled':
                    return <NotificationsNoneIcon style={{ color: '#d81b60' }} />;
               case 'group':
                    return <GroupIcon style={{ color: '#546e7a' }} />;
               case 'invitation':
               case 'invitation_accepted':
                    return <NotificationsNoneIcon style={{ color: '#0097a7' }} />;
               case 'contact':
                    return <ChatBubbleOutlineIcon style={{ color: '#546e7a' }} />;
               case 'update':
                    return <UpdateIcon style={{ color: '#6d4c41' }} />;
               default:
                    return <NotificationsNoneIcon style={{ color: '#546e7a' }} />;
          }
     };


     return (
          <div style={{
               textAlign: 'center',
               width: '100vw',
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               zIndex: 3000
          }}>
               {filteredNotifications.length > 0 ? (
                    filteredNotifications.slice(0, 1).map((notification) => (
                         <>



                              <motion.div
                                   initial={{ y: -160, opacity: 1, scale: 1 }}
                                   animate={{ y: -4, opacity: 1, scale: 1 }}
                                   transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 16,
                                        delay: 1.9,
                                        duration: 0.7
                                   }}
                                   key={0}
                                   style={{
                                        height: 50,
                                        minHeight: 50,
                                        width: 280,
                                        minWidth: 280,
                                        background: '#FFFFFF',
                                        margin: '20px auto',
                                        borderRadius: 16,
                                        boxShadow: '0 0 32px #00000033',

                                        // backdropFilter: 'blur(32px)',
                                        // WebkitBackdropFilter: 'blur(30px)',
                                        border: '0.1px solid #ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 16

                                   }}
                              >
                                   <div
                                        style={{
                                             flexShrink: 0,
                                             width: '40px',
                                             height: '40px',
                                             borderRadius: '8px',

                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             fontSize: '18px',
                                             // background: 'lime',
                                        }}
                                   >
                                        {getNotificationIcon(notification.type)}
                                   </div>
                                   <h4
                                        style={{
                                             color: '#546e7a',
                                             // background: 'lime',
                                             fontSize: 11,
                                             fontWeight: 500,
                                             textAlign: 'left',
                                             marginLeft: 10

                                        }}
                                   >
                                        <div>
                                             {notification.text.charAt(0).toUpperCase()}
                                             {/* {notification.text.slice(1)} */}
                                             {
                                                  notification.text.length > 36
                                                       ? notification.text.slice(1, 33) + '...'
                                                       : notification.text.slice(1)
                                             }
                                        </div>

                                        {/* {console.log('notification', notification)} */}
                                   </h4>
                              </motion.div>
                         </>
                    ))
               ) : (
                    <div
                         style={{
                              height: 50,
                              minHeight: 50,
                              width: 280,
                              minWidth: 280,
                              background: '#FFFFFF99',
                              margin: '20px auto',
                              borderRadius: 16,
                              boxShadow: '0 0 32px #00000033',

                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              border: '0.1px solid #ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 16

                         }}
                    >
                         <h4 style={{
                              color: '#546e7a',
                              // background: 'lime',

                         }}
                         >
                              NEW NOTIFICATION!
                         </h4>

                    </div>
               )}
          </div>
     );
};

export default NotificationOnTop;
