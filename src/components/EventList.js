import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const DiscoverOnly = ({ creatorName, date }) => {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const db = getDatabase();
    const auth = getAuth();
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        const eventsRef = ref(db, "events");
        onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const eventList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                }));

                // Filter events based on word and date
                // const filteredEvents = eventList.filter((event) => {
                //     let isMatch = true;

                //     // Filter by word (search term)
                //     if (
                //         creatorName &&
                //         !event.title.toLowerCase().includes(creatorName.toLowerCase()) &&
                //         !event.location.toLowerCase().includes(creatorName.toLowerCase()) &&
                //         !(event.organizer?.fullName && event.organizer.fullName.toLowerCase().includes(creatorName.toLowerCase()))
                //     ) {
                //         isMatch = false;
                //     }

                //     // Filter by date
                //     if (date && event.dateTime) {
                //         const eventDate = new Date(event.dateTime._seconds * 1000);
                //         const filterDate = new Date(date);

                //         if (eventDate < filterDate) {
                //             isMatch = false;
                //         }
                //     }

                //     return isMatch;
                // });
                // Replace this:
                const filteredEvents = eventList.filter((event) => {
                    let isMatch = true;

                    if (
                        creatorName &&
                        !event.title
                            .toLowerCase()
                            .includes(creatorName.toLowerCase()) &&
                        !event.location
                            .toLowerCase()
                            .includes(creatorName.toLowerCase()) &&
                        !(
                            event.organizer?.fullName &&
                            event.organizer.fullName
                                .toLowerCase()
                                .includes(creatorName.toLowerCase())
                        )
                    ) {
                        isMatch = false;
                    }

                    if (date && event.dateTime) {
                        const eventDate = new Date(
                            (event.dateTime.seconds ||
                                event.dateTime._seconds) * 1000,
                        );
                        const now = new Date();

                        if (date === "past" && eventDate >= now) {
                            isMatch = false;
                        } else if (date === "upcoming" && eventDate < now) {
                            isMatch = false;
                        }
                    }

                    return isMatch;
                });

                setEvents(filteredEvents);
            } else {
                setEvents([]);
            }
        });

        return () => unsubscribe();
    }, [creatorName, date]);

    const isUserAttending = (event) => {
        if (!user || !event.attendees) return false;
        return Object.keys(event.attendees).includes(user.uid);
    };

    const handleRSVP = async (eventId) => {
        if (!user) return;
        const attendeeRef = ref(db, `events/${eventId}/attendees/${user.uid}`);
        await update(attendeeRef, {
            fullName: user.displayName || "Anonymous",
            profileImageUrl: "",
        });
    };

    const handleCancelRSVP = async (eventId) => {
        if (!user) return;
        const attendeeRef = ref(db, `events/${eventId}/attendees/${user.uid}`);
        await remove(attendeeRef);
    };

    return (
        <div
            style={{
                maxWidth: "1006px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 auto",
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card
                            className="card-wrapper-event-list"
                            sx={{
                                // display: 'flex',
                                // flexDirection: 'column',
                                borderRadius: "16px",
                                // // width: 300,
                                // height: 340,
                                boxShadow: "none",
                                // border: '1px solid #E5E7EB',
                                // margin: '2px',
                            }}
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 1,
                                    filter: "blur(7px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    filter: "blur(0px)",
                                }}
                                transition={{ duration: 1.2, delay: 0.0 }}
                            >
                                <CardMedia
                                    component="img"
                                    alt={event.title}
                                    image={event.imageUrl}
                                    sx={{
                                        objectFit: "cover",
                                        height: 160,
                                        minHeight: 160,
                                    }}
                                />
                            </motion.div>
                            <CardContent>
                                <div
                                    className="card-content"
                                    style={
                                        {
                                            // height:106,
                                            // paddingBottom: 30,
                                            // overflowY: 'auto',
                                            // maxHeight: 106,
                                            // display: 'flex',
                                            // flexDirection: 'column',
                                            // justifyContent: 'center',
                                        }
                                    }
                                >
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: "#1F2937",
                                        }}
                                    >
                                        {event.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {(() => {
                                            if (!event.dateTime)
                                                return "No date";
                                            if (
                                                typeof event.dateTime ===
                                                "object"
                                            ) {
                                                const seconds =
                                                    event.dateTime.seconds ||
                                                    event.dateTime._seconds;
                                                if (seconds) {
                                                    const date = new Date(
                                                        seconds * 1000,
                                                    );
                                                    return date.toLocaleString(
                                                        "en-GB",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        },
                                                    );
                                                }
                                            }
                                            const date = new Date(
                                                event.dateTime,
                                            );
                                            return isNaN(date.getTime())
                                                ? "Invalid date"
                                                : date.toLocaleString("en-GB", {
                                                      day: "numeric",
                                                      month: "short",
                                                      year: "numeric",
                                                      hour: "numeric",
                                                      minute: "2-digit",
                                                      hour12: true,
                                                  });
                                        })()}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {event.location}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {event.organizer?.fullName &&
                                            `By ${event.organizer.fullName}`}
                                    </Typography>
                                </div>
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{
                                        // marginTop: 2,
                                        marginBottom: "16px",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        width: "10",
                                        display: "flex",
                                        justifyContent: "flex-end",

                                        backgroundColor: "#ffffffff",
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            navigate(`/event/${event.id}`)
                                        }
                                        style={{
                                            width: "48%",
                                            color: "#0A47A3",
                                            backgroundColor: "#EAF3FF",
                                            borderRadius: 8,
                                            borderColor: "#EAF3FF",
                                            boxShadow:
                                                "0 -6px 20px rgba(255, 255, 255, 1)",
                                        }}
                                    >
                                        Details
                                    </Button>

                                    {(() => {
                                        const now = new Date();
                                        const eventDate = new Date(
                                            (event.dateTime?.seconds ||
                                                event.dateTime?._seconds) *
                                                1000,
                                        );
                                        if (eventDate >= now) {
                                            return isUserAttending(event) ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        handleCancelRSVP(
                                                            event.id,
                                                        )
                                                    }
                                                    style={{
                                                        width: "48%",
                                                        color: "#f50057",
                                                        backgroundColor:
                                                            "#FCE4EC",
                                                        borderRadius: 8,
                                                        boxShadow: "none",
                                                        boxShadow:
                                                            "6px-6px 20px rgba(255, 255, 255, 1)",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() =>
                                                        handleRSVP(event.id)
                                                    }
                                                    style={{
                                                        width: "48%",
                                                        color: "white",
                                                        backgroundColor:
                                                            "#0A47A3",
                                                        borderRadius: 8,
                                                        boxShadow: "none",
                                                        boxShadow:
                                                            "6px -6px 20px rgba(255, 255, 255, 1)",
                                                    }}
                                                >
                                                    RSVP
                                                </Button>
                                            );
                                        }
                                        return null;
                                    })()}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DiscoverOnly;









// import React, { useEffect, useState } from 'react';
// import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
// import { getAuth } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { Grid, Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
// import { useTheme, useMediaQuery } from '@mui/material';
// import { motion } from 'framer-motion';


// const DiscoverOnly = ({ creatorName, date }) => {
//     const [events, setEvents] = useState([]);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();
//     const db = getDatabase();
//     const auth = getAuth();
//     const theme = useTheme();

//     const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//     const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//             setUser(user);
//         });

//         const eventsRef = ref(db, 'events');
//         onValue(eventsRef, (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//                 const eventList = Object.entries(data).map(([id, value]) => ({
//                     id,
//                     ...value,
//                 }));

//                 // Filter events based on word and date
//                 // const filteredEvents = eventList.filter((event) => {
//                 //     let isMatch = true;

//                 //     // Filter by word (search term)
//                 //     if (
//                 //         creatorName &&
//                 //         !event.title.toLowerCase().includes(creatorName.toLowerCase()) &&
//                 //         !event.location.toLowerCase().includes(creatorName.toLowerCase()) &&
//                 //         !(event.organizer?.fullName && event.organizer.fullName.toLowerCase().includes(creatorName.toLowerCase()))
//                 //     ) {
//                 //         isMatch = false;
//                 //     }

//                 //     // Filter by date
//                 //     if (date && event.dateTime) {
//                 //         const eventDate = new Date(event.dateTime._seconds * 1000);
//                 //         const filterDate = new Date(date);

//                 //         if (eventDate < filterDate) {
//                 //             isMatch = false;
//                 //         }
//                 //     }

//                 //     return isMatch;
//                 // });
//                 // Replace this:
//                 const filteredEvents = eventList.filter((event) => {
//                     let isMatch = true;

//                     if (
//                         creatorName &&
//                         !event.title.toLowerCase().includes(creatorName.toLowerCase()) &&
//                         !event.location.toLowerCase().includes(creatorName.toLowerCase()) &&
//                         !(event.organizer?.fullName && event.organizer.fullName.toLowerCase().includes(creatorName.toLowerCase()))
//                     ) {
//                         isMatch = false;
//                     }

//                     if (date && event.dateTime) {
//                         const eventDate = new Date((event.dateTime.seconds || event.dateTime._seconds) * 1000);
//                         const now = new Date();

//                         if (date === 'past' && eventDate >= now) {
//                             isMatch = false;
//                         } else if (date === 'upcoming' && eventDate < now) {
//                             isMatch = false;
//                         }
//                     }

//                     return isMatch;
//                 });

//                 setEvents(filteredEvents);
//             } else {
//                 setEvents([]);
//             }
//         });

//         return () => unsubscribe();
//     }, [creatorName, date]);

//     const isUserAttending = (event) => {
//         if (!user || !event.attendees) return false;
//         return Object.keys(event.attendees).includes(user.uid);
//     };

//     const handleRSVP = async (eventId) => {
//         if (!user) return;
//         const attendeeRef = ref(db, `events/${eventId}/attendees/${user.uid}`);
//         await update(attendeeRef, {
//             fullName: user.displayName || 'Anonymous',
//             profileImageUrl: '',
//         });
//     };

//     const handleCancelRSVP = async (eventId) => {
//         if (!user) return;
//         const attendeeRef = ref(db, `events/${eventId}/attendees/${user.uid}`);
//         await remove(attendeeRef);
//     };

//     return (
//         <div
//             style={{
//                 maxWidth: '1006px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 margin: '0 auto',
//             }}
//         >
//             <Grid container spacing={2} justifyContent="center">
//                 {events.map((event) => (
//                     <Grid item xs={12} sm={6} md={4} key={event.id}>
//                         <Card
                        
//                             className='card-wrapper-event-list'
//                             sx={{
//                                 // display: 'flex',
//                                 // flexDirection: 'column',
//                                 borderRadius: '16px',
//                                 // // width: 300,
//                                 // height: 340,
//                                 boxShadow: 'none',
//                                 // border: '1px solid #E5E7EB',
//                                 // margin: '2px',
//                             }}
//                         >
//                             <motion.div

//                                 initial={{ opacity: 0, scale: 1, filter: "blur(7px)" }}
//                                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                                 transition={{ duration: 1.2, delay: 0.0 }}
//                             >
//                                 <CardMedia
//                                     component="img"
//                                     alt={event.title}

//                                     image={event.imageUrl}
//                                     sx={{ objectFit: 'cover', height: 160, minHeight: 160 }}
//                                 />
//                             </motion.div>
//                             <CardContent>
//                                 <div
//                                     className='card-content'
//                                     style={{
//                                         // height:106,
//                                         // paddingBottom: 30,
//                                         // overflowY: 'auto',
//                                         // maxHeight: 106,
//                                         // display: 'flex',
//                                         // flexDirection: 'column',
//                                         // justifyContent: 'center',

//                                     }}
//                                 >
//                                     <Typography
//                                         variant="h6" gutterBottom
//                                         style={{ fontSize: 18, fontWeight: 600, color: '#1F2937' }}
//                                     >
//                                         {event.title}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         {(() => {
//                                             if (!event.dateTime) return 'No date';
//                                             if (typeof event.dateTime === 'object') {
//                                                 const seconds = event.dateTime.seconds || event.dateTime._seconds;
//                                                 if (seconds) {
//                                                     const date = new Date(seconds * 1000);
//                                                     return date.toLocaleString('en-GB', {
//                                                         day: 'numeric',
//                                                         month: 'short',
//                                                         year: 'numeric',
//                                                         hour: 'numeric',
//                                                         minute: '2-digit',
//                                                         hour12: true,
//                                                     });
//                                                 }
//                                             }
//                                             const date = new Date(event.dateTime);
//                                             return isNaN(date.getTime())
//                                                 ? 'Invalid date'
//                                                 : date.toLocaleString('en-GB', {
//                                                     day: 'numeric',
//                                                     month: 'short',
//                                                     year: 'numeric',
//                                                     hour: 'numeric',
//                                                     minute: '2-digit',
//                                                     hour12: true,
//                                                 });
//                                         })()}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         {event.location}
//                                     </Typography>



//                                     <Typography variant="body2" color="text.secondary">
//                                         {event.organizer?.fullName && `By ${event.organizer.fullName}`}
//                                     </Typography>




//                                 </div>
//                                 <Grid
//                                     container
//                                     spacing={1}
//                                     sx={{
//                                         // marginTop: 2,
//                                         marginBottom: '16px',
//                                         padding: '8px',
//                                         borderRadius: '8px',
//                                         width: '10',
//                                         display: 'flex',
//                                         justifyContent: 'flex-end',

//                                         backgroundColor: '#ffffffff',

//                                     }}
//                                 >
//                                     <Button
//                                         fullWidth
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={() => navigate(`/event/${event.id}`)}
//                                         style={{
//                                             width: '48%',
//                                             color: '#0A47A3',
//                                             backgroundColor: '#EAF3FF',
//                                             borderRadius: 8,
//                                             borderColor: '#EAF3FF',
//                                             boxShadow: '0 -6px 20px rgba(255, 255, 255, 1)',
//                                         }}
//                                     >
//                                         Details
//                                     </Button>

//                                     {(() => {
//                                         const now = new Date();
//                                         const eventDate = new Date((event.dateTime?.seconds || event.dateTime?._seconds) * 1000);
//                                         if (eventDate >= now) {
//                                             return isUserAttending(event) ? (
//                                                 <Button
//                                                     fullWidth
//                                                     variant="contained"
//                                                     color="error"
//                                                     onClick={() => handleCancelRSVP(event.id)}
//                                                     style={{
//                                                         width: '48%',
//                                                         color: '#f50057',
//                                                         backgroundColor: '#FCE4EC',
//                                                         borderRadius: 8,
//                                                         boxShadow: 'none',
//                                                         boxShadow: '6px-6px 20px rgba(255, 255, 255, 1)',
//                                                     }}
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                             ) : (
//                                                 <Button
//                                                     fullWidth
//                                                     variant="contained"
//                                                     color="success"
//                                                     onClick={() => handleRSVP(event.id)}
//                                                     style={{
//                                                         width: '48%',
//                                                         color: 'white',
//                                                         backgroundColor: '#0A47A3',
//                                                         borderRadius: 8,
//                                                         boxShadow: 'none',
//                                                         boxShadow: '6px -6px 20px rgba(255, 255, 255, 1)',
//                                                     }}
//                                                 >
//                                                     RSVP
//                                                 </Button>
//                                             );
//                                         }
//                                         return null;
//                                     })()}
//                                 </Grid>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//         </div>
//     );
// };

// export default DiscoverOnly;
