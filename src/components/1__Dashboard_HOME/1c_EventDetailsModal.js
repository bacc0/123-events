import React, { useState } from 'react';
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
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";


const EventDetailsModal = ({ event, onClose }) => {
    const navigate = useNavigate();
    return (
        <>
            <Dialog
                open={event}
                // onClose={handleCloseModal}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: 32,
                        // background: 'pink',
                        maxWidth:500,
                        maxHeight:500
                        
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                    }}
                >
                    <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                {event.title}
                            </Typography>
                    <IconButton
                     onClick={onClose}
                     >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {event && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                borderRadius: "16px",
                               
                            }}
                        >
                          
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
                                    src={event.imageUrl}
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
                                   <div
                                        className="detail-value"
                                        style={{
                                            color: "#0d47a1",
                                            cursor: "pointer",
                                            fontWeight: 500,
                                        }}
                                        onClick={() =>
                                            navigate("/public-user-profile", {
                                                state: {
                                                    uid: event.organizer?.uid,
                                                    fullName:
                                                        event.organizer?.fullName,
                                                },
                                            })
                                        }
                                    >
                                        {event.organizer?.fullName || "Unknown"}
                                    </div>

                                
                                {/* <span style={{ fontSize: 15, fontWeight: 500 }}>
                                    {event.organizer?.fullName ||
                                        "Unknown"}
                                </span> */}
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
                                            event.dateTime?.seconds ||
                                            event.dateTime?._seconds;
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
                                    {event.location || "No location"}
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
                                <span style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, lineHeight:1.5 }}>
                                    {event.description ||
                                        "No description"}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>







            {/* <div
                className="modal-overlay"
                onClick={onClose}
                style={{
                    // background: '#ff32fc66',
                    maxHeight: '100v',
                    zIndex: 10000000,
                }}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        // background: '#32ff5166',
                        maxHeight: '100v',
                        position: 'relative',
                        top: 60,
                        borderRadius: 32

                    }}
                >
                    <div className="modal-header" style={{ height: 66 }}>
                        <h2 className="modal-title">{event.title}</h2>
                        <button className="close-button" onClick={onClose}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="modal-body">
                        {event.imageUrl && (
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="modal-image"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        )}
                        <div style={{ display: "grid", gap: "20px" }}>
                            <div className="detail-item">
                                <svg
                                    className="detail-icon"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                <div className="detail-content">
                                    <div className="detail-label">
                                        Organizer
                                    </div>
                                    <div
                                        className="detail-value"
                                        style={{
                                            color: "#0d47a1",
                                            cursor: "pointer",
                                            fontWeight: 500,
                                        }}
                                        onClick={() =>
                                            navigate("/public-user-profile", {
                                                state: {
                                                    uid: event.organizer?.uid,
                                                    fullName:
                                                        event.organizer?.fullName,
                                                },
                                            })
                                        }
                                    >
                                        {event.organizer?.fullName || "Unknown"}
                                    </div>
                                </div>
                            </div>
                            <div className="detail-item">
                                <svg
                                    className="detail-icon"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                </svg>
                                <div className="detail-content">
                                    <div className="detail-label">Date & Time</div>
                                    <div className="detail-value">
                                        {(() => {
                                            // Log event object for inspection
                                            console.log(
                                                "Event details in modal:",
                                                event,
                                            );
                                            // Check for both _seconds and seconds
                                            if (
                                                event.dateTime &&
                                                (event.dateTime._seconds ||
                                                    event.dateTime.seconds)
                                            ) {
                                                const seconds =
                                                    event.dateTime._seconds ||
                                                    event.dateTime.seconds;
                                                const date = new Date(
                                                    seconds * 1000,
                                                );
                                                const dateStr =
                                                    date.toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                        },
                                                    );
                                                const timeStr =
                                                    date.toLocaleTimeString(
                                                        "en-GB",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    );
                                                return (
                                                    <>
                                                        <strong>
                                                            Date &amp; Time:
                                                        </strong>{" "}
                                                        {dateStr} at {timeStr}{" "}
                                                        <br />
                                                    </>
                                                );
                                            } else {
                                                return (
                                                    <>
                                                        <strong>
                                                            Date &amp; Time:
                                                        </strong>{" "}
                                                        Not available
                                                        <br />
                                                    </>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="detail-item">
                                <svg
                                    className="detail-icon"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                <div className="detail-content">
                                    <div className="detail-label">Location</div>
                                    <div className="detail-value">
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                            <div className="detail-item">
                                <svg
                                    className="detail-icon"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1-1H5a1 1 0 0 1-1-1V8z" />
                                </svg>
                                <div className="detail-content">
                                    <div className="detail-label">Description</div>
                                    <div className="detail-value">
                                        {event.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};


export default EventDetailsModal;