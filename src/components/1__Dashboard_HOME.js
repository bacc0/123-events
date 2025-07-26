import React, { useState, useEffect, useRef, useMemo } from "react";
// import Button from "@mui/material/Button";
import RsvpIcon from "@mui/icons-material/Rsvp";
import EventIcon from "@mui/icons-material/Event";

import CreateEventPage from "./1__Dashboard_HOME/1a_CreateEventPage";
import ConfirmationModal from "./1__Dashboard_HOME/1b_ConfirmationModal";
import EventDetailsModal from "./1__Dashboard_HOME/1c_EventDetailsModal";
import EditEventModal from "./1__Dashboard_HOME/1d_EditEventModal";

import { useMediaQuery } from "@mui/material";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from "@mui/material";

import { Timestamp } from "firebase/firestore";
import { database } from "../firebase";
import { ref as dbRef, get, child, set } from "firebase/database";

import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import {
    getDatabase,
    ref as dbRefRealtime,
    update,
    runTransaction,
    onValue,
    remove,
} from "firebase/database";

// Import notification service
import {
    sendRsvpNotification,
    sendRsvpCancelledNotification,
    sendEventCancellationNotification,
} from "./__Notification/NotificationService";

const Dashboard_HOME = () => {

    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [userInfo, setUserInfo] = useState({ fullName: "", uid: "" });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const dbRefInstance = dbRef(database);
                const snapshot = await get(child(dbRefInstance, "events"));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const eventsArray = Object.keys(data).map((key) => {
                        const event = data[key];
                        // Safely parse dateTime
                        const dateTime =
                            event.dateTime?.seconds || event.dateTime?._seconds;
                        const jsDate = dateTime ? new Date(dateTime * 1000) : null;
                        const isoString =
                            jsDate instanceof Date && !isNaN(jsDate)
                                ? jsDate.toISOString()
                                : "";
                        return {
                            id: key,
                            ...event,
                            date: isoString ? isoString.split("T")[0] : "",
                            imageUrl: event.imageUrl || "",
                        };
                    });
                    console.log("Loaded events from Realtime DB:", eventsArray);
                    setAllEvents(eventsArray);
                    // After setting events, check which events current user is attending
                    const auth = getAuth();
                    const currentUser = auth.currentUser;
                    if (currentUser) {
                        const attending = eventsArray.filter(
                            (event) => event.attendees && event.attendees[currentUser.uid],
                        );
                    }
                } else {
                    console.log("⚠️ No data available in 'events'.");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    // Fetch current user's full name and uid
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const db = getDatabase();
            const userRef = dbRefRealtime(db, "users/" + user.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data && data.fullName) {
                    setUserInfo({ fullName: data.fullName, uid: user.uid });
                }
            });
        }
    }, []);

    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState("discover");
    const [currentView, setCurrentView] = useState("dashboard");
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [confirmingAction, setConfirmingAction] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [showPastTab, setShowPastTab] = useState(false);

    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            )
                setShowNotifications(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    const handleCreateEvent = async (newEvent) => {
        try {
            let imageUrl = newEvent.imageUrl; // Use imageUrl already uploaded

            // Generate custom ID
            // Use dateTime from newEvent, not date/time
            const eventDateObj =
                newEvent.dateTime instanceof Timestamp
                    ? newEvent.dateTime.toDate()
                    : newEvent.dateTime && newEvent.dateTime.seconds
                        ? new Date(newEvent.dateTime.seconds * 1000)
                        : new Date();
            const keyName = `_v_${newEvent.title.toLowerCase().replace(/\s+/g, "_")}_${eventDateObj.getFullYear()}`;

            // Create event data with correct imageUrl and organizer info
            const eventData = {
                ...newEvent,
                id: keyName,
                imageUrl: imageUrl,
                attendeesCount: 0,
                status: "upcoming",
                organizer: {
                    fullName: userInfo.fullName,
                    uid: userInfo.uid,
                },
            };
            // Remove any old date/time fields if present
            delete eventData.date;
            delete eventData.time;

            const databaseEventRef = dbRef(database, `events/${keyName}`);
            await set(databaseEventRef, eventData);

            setMyEvents((prev) => [{ ...eventData }, ...prev]);
            setAllEvents((prev) => [{ ...eventData }, ...prev]);
            alert(`Event "${newEvent.title}" created successfully!`);
            setCurrentView("dashboard");
        } catch (error) {
            console.error("Error creating event:", error);
            alert(
                "There was an error creating the event. Please check console for details.",
            );
        }
    };

    const handleUpdateEvent = (updatedEvent) => {
        setMyEvents((prev) =>
            prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
        );
        setAllEvents((prev) =>
            prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
        );
        alert(`Event "${updatedEvent.title}" updated successfully!`);
        setEditingEvent(null);
    };

    // Updated RSVP function with notifications
    const handleRsvp = async (eventToRsvp) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to RSVP.");
            return;
        }

        // Get current user's name from userInfo state or database
        const userProfile = {
            fullName: user.displayName || userInfo.fullName || "Anonymous",
            profileImageUrl: user.photoURL || "",
        };

        try {
            const db = getDatabase();
            const attendeeRef = dbRefRealtime(
                db,
                `events/${eventToRsvp.id}/attendees/${user.uid}`,
            );
            const attendeesCountRef = dbRefRealtime(
                db,
                `events/${eventToRsvp.id}/attendeesCount`,
            );

            // Add user as attendee
            await update(attendeeRef, userProfile);

            // Increment attendeesCount atomically
            await runTransaction(attendeesCountRef, (currentValue) => {
                return (currentValue || 0) + 1;
            });

            // Send notification to event organizer (if not the same user)
            if (
                eventToRsvp.organizer?.uid &&
                eventToRsvp.organizer.uid !== user.uid
            ) {
                await sendRsvpNotification(
                    eventToRsvp.id,
                    eventToRsvp.title,
                    eventToRsvp.organizer.uid,
                    userProfile.fullName,
                );
            }

            // Update UI state
            setAllEvents((prev) =>
                prev.map((e) => {
                    if (e.id === eventToRsvp.id) {
                        const updated = { ...e };
                        updated.attendees = {
                            ...(updated.attendees || {}),
                            [user.uid]: userProfile,
                        };
                        updated.attendeesCount = (updated.attendeesCount || 0) + 1;
                        return updated;
                    }
                    return e;
                }),
            );

            alert(`You have successfully RSVP'd to "${eventToRsvp.title}"!`);
        } catch (error) {
            console.error("❌ Error RSVPing to event:", error);
            alert("There was an error with your RSVP. Please try again.");
        }
    };

    // Updated cancel RSVP function with notifications
    const handleCancelRsvp = async (eventToLeave) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to cancel RSVP.");
            return;
        }

        try {
            const db = getDatabase();
            const eventId = eventToLeave.id;
            const userId = user.uid;

            console.log("Cancelling RSVP for event:", eventId);
            console.log("Removing attendee:", userId);

            const attendeeRef = dbRefRealtime(
                db,
                `events/${eventId}/attendees/${userId}`,
            );
            const attendeesCountRef = dbRefRealtime(
                db,
                `events/${eventId}/attendeesCount`,
            );

            await remove(attendeeRef); // Delete the attendee

            await runTransaction(attendeesCountRef, (currentValue) => {
                return (currentValue || 1) > 0 ? currentValue - 1 : 0;
            });

            // Send notification to event organizer (if not the same user)
            if (
                eventToLeave.organizer?.uid &&
                eventToLeave.organizer.uid !== userId
            ) {
                const userName = userInfo.fullName || user.displayName || "Someone";
                await sendRsvpCancelledNotification(
                    eventId,
                    eventToLeave.title,
                    eventToLeave.organizer.uid,
                    userName,
                );
            }

            // Update UI state
            setAllEvents((prev) =>
                prev.map((e) => {
                    if (e.id === eventId) {
                        const updated = { ...e };
                        if (updated.attendees) {
                            delete updated.attendees[userId];
                        }
                        updated.attendeesCount = Math.max(
                            (updated.attendeesCount || 1) - 1,
                            0,
                        );
                        return updated;
                    }
                    return e;
                }),
            );

            setConfirmingAction(null);
        } catch (error) {
            console.error("❌ Error cancelling RSVP:", error);
            alert("There was an error cancelling your RSVP.");
        }
    };

    const [eventToConfirmDelete, setEventToConfirmDelete] = useState(null);

    // Updated delete event function with notifications
    const handleDeleteEvent = async (eventToDelete) => {
        try {
            const db = getDatabase();

            // Get list of attendees to notify them
            const attendeeUids = eventToDelete.attendees
                ? Object.keys(eventToDelete.attendees).filter(
                    (uid) => uid !== userInfo.uid,
                )
                : [];

            // Send cancellation notifications to all attendees
            if (attendeeUids.length > 0) {
                await sendEventCancellationNotification(
                    eventToDelete.id,
                    eventToDelete.title,
                    attendeeUids,
                );
            }

            // Delete the event from database
            const eventRef = dbRef(database, `events/${eventToDelete.id}`);
            await remove(eventRef);

            // Update UI state
            setMyEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
            setAllEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
            setConfirmingAction(null);

            // alert(`Event "${eventToDelete.title}" has been cancelled and all attendees have been notified.`);
        } catch (error) {
            console.error("❌ Error deleting event:", error);
            alert("There was an error cancelling the event.");
        }
    };

    const clearFilters = () => {
        setLocationFilter("");
        setStartDateFilter("");
        setEndDateFilter("");
    };

    const publicEvents = useMemo(() => {
        const filtered = allEvents.filter((event) => {
            const keywordMatch =
                searchQuery === "" ||
                (event.title &&
                    event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (event.description &&
                    event.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const locationMatch =
                locationFilter === "" ||
                (event.location &&
                    event.location.toLowerCase().includes(locationFilter.toLowerCase()));

            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            let eventDate = null;
            if (
                event.dateTime &&
                (event.dateTime._seconds || event.dateTime.seconds)
            ) {
                const seconds = event.dateTime._seconds || event.dateTime.seconds;
                eventDate = new Date(seconds * 1000);
            } else if (event.date) {
                eventDate = new Date(event.date);
            }

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);

            const dateMatch =
                (!startDate || (eventDate && eventDate >= startDate)) &&
                (!endDate || (eventDate && eventDate <= endDate));

            let isPastEvent = false,
                isFutureEvent = false;
            if (eventDate) {
                const now = new Date();
                isPastEvent = eventDate < now;
                isFutureEvent = eventDate >= now;
            }
            if (showPastTab && !isPastEvent) return false;
            if (!showPastTab && !isFutureEvent) return false;

            return keywordMatch && locationMatch && dateMatch;
        });

        return filtered.sort((a, b) => {
            const aDate =
                a.dateTime?.seconds ||
                a.dateTime?._seconds ||
                new Date(a.date).getTime() / 1000;
            const bDate =
                b.dateTime?.seconds ||
                b.dateTime?._seconds ||
                new Date(b.date).getTime() / 1000;
            return showPastTab ? bDate - aDate : aDate - bDate;
        });
    }, [
        allEvents,
        searchQuery,
        locationFilter,
        startDateFilter,
        endDateFilter,
        showPastTab,
    ]);

    // Immediate search handler
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Immediate location filter handler
    const handleLocationChange = (e) => {
        setLocationFilter(e.target.value);
    };

    // Memoized list of events created by the current user
    const myCreatedEvents = useMemo(
        () =>
            allEvents.filter(
                (event) => event.organizer && event.organizer.uid === userInfo.uid,
            ),
        [allEvents, userInfo.uid],
    );

    const renderEventCard = (event) => {
        const isMyEvent = myEvents.some((e) => e.id === event.id);

        // Get current user for attendee check
        const auth = getAuth();
        const user = auth.currentUser;
        // Check if the user is an attendee based on live Firebase data
        const isUserAttending = event.attendees && event.attendees[user?.uid];

        // Use event.dateTime for display if present
        let dateDisplay = "";
        if (event.dateTime && (event.dateTime._seconds || event.dateTime.seconds)) {
            const seconds = event.dateTime._seconds || event.dateTime.seconds;
            const dateObj = new Date(seconds * 1000);
            dateDisplay = dateObj.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
            });
        } else if (event.date) {
            dateDisplay = new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
            });
        } else {
            dateDisplay = "Not available";
        }

        // Helper handlers for Details/RSVP/Cancel
        const handleDetails = (eventObj) => setSelectedEvent(eventObj);
        const handleEdit = (eventObj) => setEditingEvent(eventObj);
        const handleDelete = (eventObj) =>
            setConfirmingAction({ type: "delete", event: eventObj });
        const handleCancelRsvpClick = (eventObj) =>
            setConfirmingAction({ type: "rsvp_cancel", event: eventObj });

        return (
            <motion.div key={event.id} className="event-card">
                <div
                    style={{
                        backgroundColor: "#F3F5F7",
                        backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                        backgroundSize: "66%", // Scale image to 23% of container
                        backgroundPosition: "center", // Centre the image
                        backgroundRepeat: "no-repeat", // Do not repeat the image
                    }}
                >
                    {event.imageUrl ? (
                        <motion.img
                            // style={{ background: "#E5E5E5" }}
                            style={{
                                backgroundColor: "#F3F5F7",
                                backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                                backgroundSize: "66%", // Scale image to 23% of container
                                backgroundPosition: "center", // Centre the image
                                backgroundRepeat: "no-repeat", // Do not repeat the image
                            }}
                            initial={{ opacity: 0, scale: 1, filter: "blur(7px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.6, delay: 0.0 }}
                            src={event.imageUrl}
                            alt={event.title}
                            className="event-image"
                            onError={(e) => {
                                e.target.onerror = "";
                                e.target.src =
                                    "https://placehold.co/400x240/f8f9fa/9ca3af?text=No+Image";
                            }}
                        />
                    ) : (
                        <div className="event-image-placeholder">
                            <div
                                style={{
                                    width: 33,
                                    height: 33,
                                    backgroundColor: "#F3F5F7",
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG.svg)`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            ></div>
                        </div>
                    )}
                </div>
                <div className="event-content">
                    <div>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-meta">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                            </svg>
                            {dateDisplay}
                        </div>
                        <div className="event-meta">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                            {event.location}
                        </div>
                    </div>
                    <div className="event-actions">
                        <Button
                            onClick={() => handleDetails(event)}
                            style={{
                                backgroundColor: "#eaf3ff",
                                color: "#0a47a3",
                                marginRight: "8px",
                                borderRadius: "12px",
                                fontWeight: "500",
                                borderRadius: 8,
                                width: "100%",
                                height: 36,
                                maxHeight: 36,
                            }}
                        >
                            Details
                        </Button>

                        {event.organizer?.uid === user?.uid ? (
                            <>
                                <Button
                                    onClick={() => handleDelete(event)}
                                    variant="outlined"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        color: "#f50057",
                                        marginLeft: "2%",
                                        borderRadius: 8,
                                        width: "47.5%",
                                        minWidth: "47.5%",
                                        maxWidth: "47.5%",
                                        borderColor: "#fce4ec",
                                        height: 36,
                                        maxHeight: 36,
                                    }}
                                // endIcon={}
                                >
                                    DELETE
                                    <span
                                        style={{
                                            position: "relative",
                                            top: 3.5,
                                            left: 5,
                                            color: "#fce4ec",
                                        }}
                                    >
                                        <EventIcon />
                                    </span>
                                </Button>

                                <Dialog
                                    open={!!eventToConfirmDelete}
                                    onClose={() => setEventToConfirmDelete(null)}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle>Cancel Event</DialogTitle>
                                    <DialogContent>
                                        <Typography>
                                            Are you sure you want to cancel your event "
                                            {eventToConfirmDelete?.title}"?
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={() => setEventToConfirmDelete(null)}
                                            variant="outlined"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleDeleteEvent(eventToConfirmDelete);
                                                setEventToConfirmDelete(null);
                                            }}
                                            variant="contained"
                                            color="error"
                                        >
                                            Yes, Cancel Event
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                        ) : (
                            <>
                                {(() => {
                                    let eventDate = null;
                                    if (event.dateTime?._seconds || event.dateTime?.seconds) {
                                        const seconds =
                                            event.dateTime._seconds || event.dateTime.seconds;
                                        eventDate = new Date(seconds * 1000);
                                    } else if (event.date) {
                                        eventDate = new Date(event.date);
                                    }
                                    const isPast =
                                        eventDate && eventDate.getTime() < new Date().getTime();

                                    if (!isPast) {
                                        return isUserAttending ? (
                                            <Button
                                                onClick={() => handleCancelRsvpClick(event)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "#fce4ec",
                                                    color: "#f50057",
                                                    borderRadius: 8,
                                                    width: "47.5%",
                                                    minWidth: "47.5%",
                                                    maxWidth: "47.5%",
                                                    height: 36,
                                                    maxHeight: 36,
                                                }}
                                                endIcon={<RsvpIcon />}
                                            >
                                                Cancel
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleRsvp(event)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "#0a47a3",
                                                    color: "white",
                                                    marginLeft: "2%",
                                                    marginLeft: "8px",
                                                    borderRadius: 8,
                                                    width: "47.5%",
                                                    minWidth: "47.5%",
                                                    maxWidth: "47.5%",
                                                    height: 36,
                                                    maxHeight: 36,
                                                }}
                                            >
                                                RSVP
                                            </Button>
                                        );
                                    }
                                    return null;
                                })()}
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    // 🔽 PAGINATION LOGIC (infinite scroll)
    // Loads events in chunks of CARDS_PER_PAGE when scrolling near bottom.
    // This helps improve performance by avoiding rendering all cards at once.

    const smallerThan = useMediaQuery("(max-width:600px)");

    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [eventPage, setEventPage] = useState(1);
    const CARDS_PER_PAGE = smallerThan ? 4 : 6;

    useEffect(() => {
        const start = 0;
        const end = eventPage * CARDS_PER_PAGE;
        setDisplayedEvents(publicEvents.slice(start, end));
    }, [publicEvents, eventPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                if (displayedEvents.length < publicEvents.length) {
                    setEventPage((prev) => prev + 1);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [displayedEvents, publicEvents]);




    return (
        <div className="app-container" style={{ marginTop: 41, paddingBottom: 44 }}>
            <link rel="stylesheet" href="/universal-styles.css" />
            {currentView === "dashboard" ? (
                <main className="main-content">
                    <h3
                        style={{ color: "#78909c", }}
                    >
                        Events
                    </h3>

                    <div className="card card-padded"
                        style={{
                            // background: '#32ed2555',
                            padding: '38px 23px 62px',
                            borderRadius: 32
                        }}
                    >
                        <div
                            className="section-header"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap",
                                gap: "12px",



                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div className="search-box">
                                    <svg
                                        className="search-icon"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by keyword..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                </div>
                                <Button
                                    style={{
                                        color: "#0A47A3",
                                        border: "1px solid #0A47A3",
                                        borderRadius: 8,
                                        height: 35,
                                        minWidth: 138,
                                        backgroundColor: showFilters ? "#EAF3FF" : "#ffffff00",
                                    }}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Filters
                                </Button>
                            </div>
                            <Button
                                className={`tab ${showPastTab ? "tab-active-past" : ""}`}
                                onClick={() => {
                                    setActiveTab("discover");
                                    setShowPastTab((prev) => !prev);
                                }}
                                style={{
                                    color: showPastTab ? "#0A47A3" : "#90a4ae",
                                    border: showPastTab
                                        ? "1px solid #0A47A3"
                                        : "1px solid #cfd8dc",
                                    borderRadius: 8,
                                    height: 35,
                                    minWidth: 138,
                                }}
                            >
                                Past Events
                            </Button>
                            <Button
                                className="btn btn-primary"
                                onClick={() => setCurrentView("createEvent")}
                                style={{
                                    color: "white",
                                    backgroundColor: "#0A47A3",
                                    border: "1px solid #0A47A3",
                                    borderRadius: 8,
                                    minWidth: 140,
                                    height: 35,
                                }}
                            >
                                Create Event
                            </Button>
                        </div>

                        {showFilters && (
                            <div
                                style={{
                                    borderRadius: 16,
                                }}
                                className="filter-panel"
                            >
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="location">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        className="form-input"
                                        placeholder="e.g. London"
                                        value={locationFilter}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="start-date">
                                        From
                                    </label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        className="form-input"
                                        value={startDateFilter}
                                        onChange={(e) => setStartDateFilter(e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="end-date">
                                        To
                                    </label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        className="form-input"
                                        value={endDateFilter}
                                        onChange={(e) => setEndDateFilter(e.target.value)}
                                    />
                                </div>
                                <Button
                                    style={{
                                        color: "#90a4ae",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #b0bec5",
                                        borderRadius: 8,
                                        minWidth: 90,
                                        height: 35,
                                    }}
                                    className="btn btn-outline"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </Button>
                            </div>
                        )}

                        <div
                            className="tabs"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <button
                                className={`tab ${activeTab === "discover" && !showPastTab ? "tab-active" : ""}`}
                                onClick={() => {
                                    setActiveTab("discover");
                                    setShowPastTab(false);
                                }}
                            >
                                Discover
                            </button>
                            <button
                                className={`tab ${activeTab === "myEvents" ? "tab-active" : ""}`}
                                onClick={() => {
                                    setActiveTab("myEvents");
                                    setShowPastTab(false);
                                }}
                            >
                                My Events
                            </button>
                            <button
                                className={`tab ${activeTab === "attending" ? "tab-active" : ""}`}
                                onClick={() => {
                                    setActiveTab("attending");
                                    setShowPastTab(false);
                                }}
                            >
                                Attending
                            </button>
                        </div>
                        <div className="events-grid">
                            {activeTab === "discover" &&
                                (publicEvents.length > 0 ? (
                                    displayedEvents.map((event) => renderEventCard(event))
                                ) : (
                                    <div className="empty-state">
                                        <p>No events match your criteria.</p>
                                    </div>
                                ))}
                            {activeTab === "myEvents" &&
                                (() => {
                                    const now = new Date();
                                    const upcomingCreatedEvents = myCreatedEvents.filter(
                                        (event) => {
                                            let eventDate = null;
                                            if (event.dateTime?._seconds || event.dateTime?.seconds) {
                                                const seconds =
                                                    event.dateTime._seconds || event.dateTime.seconds;
                                                eventDate = new Date(seconds * 1000);
                                            } else if (event.date) {
                                                eventDate = new Date(event.date);
                                            }
                                            return eventDate && eventDate.getTime() >= now.getTime();
                                        },
                                    );

                                    const pastCreatedEvents = myCreatedEvents.filter((event) => {
                                        let eventDate = null;
                                        if (event.dateTime?._seconds || event.dateTime?.seconds) {
                                            const seconds =
                                                event.dateTime._seconds || event.dateTime.seconds;
                                            eventDate = new Date(seconds * 1000);
                                        } else if (event.date) {
                                            eventDate = new Date(event.date);
                                        }
                                        return eventDate && eventDate.getTime() < now.getTime();
                                    });

                                    return (
                                        <>
                                            <>
                                                {upcomingCreatedEvents.length > 0 ? (
                                                    upcomingCreatedEvents.map((event) =>
                                                        renderEventCard(event),
                                                    )
                                                ) : (
                                                    <div className="empty-state">
                                                        <p>You haven't created any upcoming events.</p>
                                                    </div>
                                                )}
                                            </>

                                            <>
                                                {pastCreatedEvents.length > 0 && (
                                                    <>
                                                        <div
                                                            style={{
                                                                color: "#90a4ae",
                                                                marginTop: "40px",
                                                                marginBottom: "12px",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/pastEvents.svg)`,
                                                                    backgroundSize: "47%",
                                                                    backgroundPosition: "center",
                                                                    backgroundRepeat: "no-repeat",

                                                                    minWidth: 160,
                                                                    minHeight: 160,
                                                                    opacity: 0.45,
                                                                    marginTop: -40,
                                                                }}
                                                            />
                                                        </div>

                                                        {pastCreatedEvents.map((event) =>
                                                            renderEventCard(event),
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        </>
                                    );
                                })()}

                            {activeTab === "attending" &&
                                (() => {
                                    const now = new Date();
                                    const upcomingAttendingEvents = allEvents.filter((event) => {
                                        const isAttending =
                                            event.attendees && event.attendees[userInfo?.uid];

                                        let eventDate = null;
                                        if (event.dateTime?._seconds || event.dateTime?.seconds) {
                                            const seconds =
                                                event.dateTime._seconds || event.dateTime.seconds;
                                            eventDate = new Date(seconds * 1000);
                                        } else if (event.date) {
                                            eventDate = new Date(event.date);
                                        }

                                        const isFuture =
                                            eventDate && eventDate.getTime() >= now.getTime();

                                        return isAttending && isFuture;
                                    });

                                    return upcomingAttendingEvents.length > 0 ? (
                                        upcomingAttendingEvents.map((event) =>
                                            renderEventCard(event),
                                        )
                                    ) : (
                                        <div className="empty-state">
                                            <p>You are not attending any upcoming events.</p>
                                        </div>
                                    );
                                })()}
                        </div>
                    </div>
                </main>
            ) : (
                <CreateEventPage
                    onSave={handleCreateEvent}
                    onCancel={() => setCurrentView("dashboard")}
                />
            )}
            {selectedEvent && (
                <EventDetailsModal
                    open={selectedEvent}
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onSave={handleUpdateEvent}
                    onClose={() => setEditingEvent(null)}
                />
            )}
            {confirmingAction && (
                <ConfirmationModal
                    title={
                        confirmingAction.type === "delete" ? "Cancel Event" : "Cancel RSVP"
                    }
                    message={
                        confirmingAction.type === "delete"
                            ? `Are you sure you want to permanently cancel and delete "${confirmingAction.event.title}"? This action cannot be undone.`
                            : `Are you sure you want to cancel your RSVP for "${confirmingAction.event.title}"?`
                    }
                    confirmText={
                        confirmingAction.type === "delete"
                            ? "Yes, Cancel Event"
                            : "Yes, Cancel RSVP"
                    }
                    onConfirm={() =>
                        confirmingAction.type === "delete"
                            ? handleDeleteEvent(confirmingAction.event)
                            : handleCancelRsvp(confirmingAction.event)
                    }
                    onCancel={() => setConfirmingAction(null)}
                />
            )}
        </div>
    );
};

export default Dashboard_HOME;
