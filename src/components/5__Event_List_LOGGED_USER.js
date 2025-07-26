import React, { useEffect, useState } from "react";
import Modal_Edit_Event from "./A__Modal_Edit_Event";
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
// MUI Dialog-related imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";

const DiscoverOnly = ({ creatorName, date }) => {
    // Modal state and handlers
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [selectedEventId, setSelectedEventId] = useState("");
    const [editOpen, setEditOpen] = useState(false);

    const handleOpenModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
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
        <>
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
                                    style={{
                                        backgroundColor: "#F3F5F7",
                                        backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                                        backgroundSize: "66%", // Scale image to 23% of container
                                        backgroundPosition: "center", // Centre the image
                                        backgroundRepeat: "no-repeat", // Do not repeat the image
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        // alt={event.title}
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
                                                        event.dateTime
                                                            .seconds ||
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
                                                    : date.toLocaleString(
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
                                                handleOpenModal(event)
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
                                                return isUserAttending(
                                                    event,
                                                ) ? (
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
                                                                "0 0 0px rgba(255, 255, 255, 1)",
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="success"
                                                        // onClick={() =>
                                                        //     handleRSVP(event.id)
                                                        // }
                                                        onClick={() => { 
                                                            setSelectedEventId(event.id); setEditOpen(true); 
                                                        }}
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
                                                        Edit 
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
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: 32,
                           maxWidth: 500,
                        maxHeight: 500
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: 12,
                    }}
                >
                    {/* Event Details */}
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                borderRadius: "16px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedEvent.title}
                            </Typography>
                            <div
                                style={{
                                    maxHeight: 240,
                                    height: 240,
                                    borderRadius: 16,
                                    backgroundColor: "#F3F5F7",
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                                    backgroundSize: "66%", // Scale image to 23% of container
                                    backgroundPosition: "center", // Centre the image
                                    backgroundRepeat: "no-repeat", // Do not repeat the image
                                }}
                            >
                                <motion.img
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
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    src={selectedEvent.imageUrl}
                                    style={{
                                        width: "100%",
                                        borderRadius: 16,
                                        border: "0.3px solid #90a4ae",
                                        objectFit: "cover",
                                        maxHeight: 240,
                                        height: 240,
                                        backgroundColor: "#F3F5F7",
                                        backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                                        backgroundSize: "66%", // Scale image to 23% of container
                                        backgroundPosition: "center", // Centre the image
                                        backgroundRepeat: "no-repeat", // Do not repeat the image
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <PersonIcon
                                    fontSize="small"
                                    sx={{ color: "#b0bec5" }}
                                />
                                <span
                                    style={{
                                        margin: "5px 15px 0 0",
                                        color: "#78909c",
                                        fontSize: 13,
                                        marginBottom: 4,
                                    }}
                                >
                                    Organizer:
                                </span>
                                <span style={{ fontSize: 15, fontWeight: 500 }}>
                                    {selectedEvent.organizer?.fullName ||
                                        "Unknown"}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    margin: "1px 0px 0 0",
                                }}
                            >
                                <CalendarTodayIcon
                                    fontSize="small"
                                    sx={{ color: "#b0bec5" }}
                                />
                                <span
                                    style={{
                                        margin: "2px 0 0 0",
                                        color: "#78909c",
                                        fontSize: 13,
                                        marginBottom: 4,
                                    }}
                                >
                                    Date & Time:
                                </span>
                                <span style={{ fontSize: 15, fontWeight: 500 }}>
                                    {(() => {
                                        const seconds =
                                            selectedEvent.dateTime?.seconds ||
                                            selectedEvent.dateTime?._seconds;
                                        if (seconds) {
                                            const date = new Date(
                                                seconds * 1000,
                                            );
                                            return date.toLocaleString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",

                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            );
                                        }
                                        return "No date provided";
                                    })()}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <LocationOnIcon
                                    fontSize="small"
                                    sx={{ color: "#b0bec5" }}
                                />
                                <span
                                    style={{
                                        margin: "2px 21px 0 0",
                                        color: "#78909c",
                                        fontSize: 13,
                                        marginBottom: 4,
                                    }}
                                >
                                    Location:
                                </span>
                                <span style={{ fontSize: 15, fontWeight: 500 }}>
                                    {selectedEvent.location || "No location"}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    margin: "1px 0px 0 0",
                                }}
                            >
                                <InfoIcon
                                    fontSize="small"
                                    sx={{
                                        color: "#b0bec5",
                                        margin: "-18px 0 0 0",
                                    }}
                                />
                                <span
                                    style={{
                                        margin: "-15px 5px 0 0",
                                        color: "#78909c",
                                        fontSize: 13,
                                        marginBottom: 4,

                                    }}
                                >
                                    Description:
                                </span>
                                <span style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
                                    {selectedEvent.description ||
                                        "No description"}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <Modal_Edit_Event
                eventId={selectedEventId}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                refreshEvents={() => {}}
            />
        </>
    );
};

export default DiscoverOnly;
