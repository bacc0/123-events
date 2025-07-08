// // This component displays the dashboard page with event filters, tabs, and event cards.
// import React, { useState } from "react";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import {
//     Typography,
//     Button,
//     Box,
//     TextField,
//     InputAdornment,
//     Paper,
//     Tabs,
//     Tab,
//     Card,
//     CardContent,
//     CardMedia,
//     Grid,
//     Divider,
//     useMediaQuery
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import dayjs from "dayjs";

// export default function Dashboard() {
//     const [fromDate, setFromDate] = useState(dayjs('2025-07-02'));
//     const [toDate, setToDate] = useState(dayjs('2025-07-30'));
//     const [tabValue, setTabValue] = useState(0);

//     const isSmallScreen = useMediaQuery('(max-width:839px)');

//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <Box sx={{ p: 3 }}>
//                 <Paper sx={{ p: 2, mb: 3, borderRadius: "12px", boxShadow: 0, backgroundColor: "#F5F5F5" }}>
//                     <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                         Events
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, justifyContent: 'center' }}>
//                         <TextField
//                             placeholder="Search by keyword..."
//                             size="medium"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon />
//                                     </InputAdornment>
//                                 )
//                             }}
//                             sx={{
//                                 height: 56,
//                                 backgroundColor: "#ffffff",
//                                 borderRadius: "8px",
//                                 marginBottom: 2,
//                                 width: { xs: '100%', sm: '246px' }
//                             }}
//                         />
//                         <TextField
//                             placeholder="e.g. London"
//                             label="Location"
//                             size="medium"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <LocationOnIcon />
//                                     </InputAdornment>
//                                 )
//                             }}
//                             sx={{
//                                 height: 56,
//                                 backgroundColor: "#ffffff",
//                                 borderRadius: "8px",
//                                 marginBottom: 2,
//                                 width: { xs: '100%', sm: '246px' }
//                             }}
//                         />
//                         <span
//                             style={{
//                                 background: '#ffffff',
//                                 borderRadius: 3,
//                                 height: 56,
//                                 marginBottom: '16px',

//                             }}>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="From"
//                                     value={fromDate}
//                                     onChange={(newValue) => setFromDate(newValue)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             size="small"
//                                             sx={{
//                                                 height: 56,
//                                                 borderRadius: "8px",
//                                                 width: { xs: '100%', sm: 'auto' }
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </LocalizationProvider>
//                         </span>
//                         <span style={{ background: '#ffffff', borderRadius: 3, height: 56 }}>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="To"
//                                     value={toDate}
//                                     onChange={(newValue) => setToDate(newValue)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             size="small"
//                                             sx={{
//                                                 height: 40,
//                                                 width: { xs: '100%', sm: 'auto' }
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </LocalizationProvider>
//                         </span>

//                         {isSmallScreen ? (
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     flexDirection: "column",
//                                     width: "100%",
//                                     gap: 1,
//                                     mt: 1
//                                 }}
//                             >
//                                 <Button variant="outlined"
//                                     sx={{
//                                         borderColor: "#003E99",
//                                         color: "#003E99",
//                                         flex: 1,
//                                         borderRadius: "8px",
//                                         minWidth: 0,
//                                         marginBottom: 1.5,
//                                         marginTop: 1,
//                                         padding: "10px",
//                                         width: { xs: '75%', sm: '507px' }
//                                     }}

//                                 >Filters</Button>
//                                 <Button variant="outlined" color="error" sx={{
//                                     flex: 1,
//                                     borderRadius: "8px",
//                                     minWidth: 0,
//                                     marginBottom: 1.5,
//                                     marginTop: 1,
//                                     padding: "10px",
//                                     width: { xs: '75%', sm: '507px' }
//                                 }}>Clear</Button>
//                                 <Button
//                                     variant="contained"
//                                     sx={{
//                                         flex: 1,
//                                         borderRadius: "8px",
//                                         minWidth: 0,
//                                         bgcolor: "#003E99",
//                                         "&:hover": {
//                                             bgcolor: "#0052CC"
//                                         },
//                                         marginBottom: 1.5,
//                                         marginTop: 1,
//                                         padding: "10px",
//                                         width: { xs: '75%', sm: '507px' }
//                                     }}
//                                 >
//                                     Create Event
//                                 </Button>
//                             </Box>
//                         ) : (
//                             <>
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "flex-end",
//                                         justifyContent: "space-between",
//                                         gap: "16px"
//                                     }}
//                                 >
//                                     <Button
//                                         variant="outlined"
//                                         sx={{
//                                             height: 40,
//                                             width: 160,
//                                             borderRadius: "8px",
//                                             borderColor: "#003E99",
//                                             color: "#003E99",
//                                         }}
//                                     >
//                                         Filters
//                                     </Button>
//                                     <Button
//                                         variant="outlined"
//                                         color="error"
//                                         sx={{ height: 40, width: 160, borderRadius: "8px" }}
//                                     >
//                                         Clear
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         sx={{
//                                             height: 40,
//                                             width: 160,
//                                             borderRadius: "8px",
//                                             bgcolor: "#003E99",
//                                             "&:hover": {
//                                                 bgcolor: "#0052CC"
//                                             },
//                                         }}
//                                     >
//                                         Create Event
//                                     </Button>
//                                 </div>
//                             </>
//                         )}
//                     </Box>
//                 </Paper>

//                 <Tabs
//                     value={tabValue}
//                     onChange={(event, newValue) => setTabValue(newValue)}
//                     textColor="primary"
//                     indicatorColor="primary"
//                     sx={{
//                         mb: 3,
//                     }}
//                 >
//                     <Tab label="Discover" />
//                     <Tab label="My Events" />
//                     <Tab label="Attending" />
//                 </Tabs>

//                 {tabValue === 0 && (
//                     <Grid container spacing={2} justifyContent="center">
//                         {[1, 2, 3].map(item => (
//                             <Grid item xs={12} sm={6} md={4} key={item}>
//                                 <Card
//                                     sx={{
//                                         borderRadius: "12px",
//                                         transition: "all 0.3s ease",
//                                         boxShadow: 1,
//                                         "&:hover": {
//                                             boxShadow: 3,
//                                             transform: "translateY(-3px)"
//                                         },
//                                         maxWidth: 388,
//                                         margin: isSmallScreen ? "auto" : undefined
//                                     }}
//                                 >
//                                     <CardMedia
//                                         component="img"
//                                         height="258"
//                                         image="https://images.unsplash.com/photo-1663680942106-883c2e50c05f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//                                         alt="Event image"
//                                         sx={{
//                                             borderTopLeftRadius: "12px",
//                                             borderTopRightRadius: "12px"
//                                         }}
//                                     />
//                                     <CardContent>
//                                         <Typography
//                                             style={{
//                                                 position: "relative",
//                                                 top: "-215px",
//                                                 left: -20,
//                                                 marginTop: -60,
//                                                 fontSize: "1.2rem",
//                                                 fontWeight: "bold",
//                                                 textShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
//                                                 color: "#ffffff",
//                                                 background: `linear-gradient(to right, transparent,transparent, #00000011, transparent, transparent)`,
//                                                 borderRadius: "8px",
//                                                 padding: "8px 12px",
//                                                 textAlign: "center",
//                                                 backdropFilter: 'blur(12px)',
//                                                 WebkitBackdropFilter: 'blur(12px)',
//                                                 width: 'calc(100% + 40px)',
//                                                 borderBottom: "0.2px solid #00000011",
//                                             }}
//                                             variant="h6" sx={{ mb: 1 }}>
//                                             Event Title {item}
//                                         </Typography>
//                                         <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
//                                             <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
//                                             <Typography variant="body2">20 July</Typography>
//                                         </Box>
//                                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                                             <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
//                                             <Typography variant="body2">Hyde Park, London</Typography>
//                                         </Box>
//                                         <Divider sx={{ my: 1.5 }} />
//                                         <Box
//                                             sx={{
//                                                 display: "flex",
//                                                 justifyContent: "space-between",
//                                                 gap: 1
//                                             }}
//                                         >
//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 sx={{
//                                                     flex: 1,
//                                                     height: 40,
//                                                     borderRadius: "8px",
//                                                     minWidth: 0,
//                                                     borderColor: "#003E99",
//                                                     color: "#003E99",
//                                                     marginBottom: -1.5,
//                                                 }}
//                                             >
//                                                 Details
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 sx={{
//                                                     flex: 1,
//                                                     height: 40,
//                                                     borderRadius: "8px",
//                                                     minWidth: 0,
//                                                     bgcolor: "#003E99",
//                                                     "&:hover": {
//                                                         bgcolor: "#0052CC"
//                                                     },
//                                                     marginBottom: -1.5,
//                                                 }}
//                                             >
//                                                 Edit
//                                             </Button>
//                                             <Button
//                                                 variant="outlined"
//                                                 color="error"
//                                                 size="small"
//                                                 sx={{
//                                                     flex: 1,
//                                                     height: 40,
//                                                     borderRadius: "8px",
//                                                     minWidth: 0,
//                                                     marginBottom: -1.5,
//                                                 }}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 )}

//                 {tabValue === 1 && (
//                     <Typography variant="body1">These are your events.</Typography>
//                 )}

//                 {tabValue === 2 && (
//                     <Typography variant="body1">Events you are attending.</Typography>
//                 )}
//             </Box>
//         </Box >
//     );
// }


import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- Mock Data ---
const initialMyEvents = [
    { id: 1, title: 'Tech Conference 2025', date: '2025-03-15', time: '09:00', location: 'Convention Center, London', attendees: 45, status: 'upcoming', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=240&fit=crop&crop=center', description: 'Join us for an exciting day of innovation and networking at our annual tech conference.' },
    { id: 2, title: 'Product Launch Party', date: '2025-03-22', time: '18:00', location: 'Rooftop Venue, Canary Wharf', attendees: 120, status: 'upcoming', image: null, description: 'Celebrate the launch of our latest product with cocktails and networking.' },
];

const initialAttendingEvents = [
    { id: 4, title: 'Marketing Summit 2025', date: '2025-03-18', time: '10:00', location: 'Excel London', organizer: 'Sarah Johnson', rsvpStatus: 'accepted', attendees: 200, image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=240&fit=crop&crop=center', description: 'Annual marketing summit featuring keynote speakers, workshops, and networking opportunities.' }
];

const initialAllEvents = [
    ...initialMyEvents,
    ...initialAttendingEvents,
    { id: 5, title: 'Art & Design Fair', date: '2025-04-05', time: '11:00', location: 'Somerset House, London', organizer: 'Creative UK', attendees: 1500, image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=240&fit=crop&crop=center', description: 'Discover contemporary art from emerging artists and designers.' },
    { id: 6, title: 'Music Festival', date: '2025-07-20', time: '12:00', location: 'Hyde Park, London', organizer: 'LiveNation', attendees: 50000, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop&crop=center', description: 'A weekend of live music from the world\'s biggest artists.' },
    { id: 7, title: 'Manchester Tech Expo', date: '2025-05-10', time: '09:00', location: 'Manchester Central', organizer: 'TechNorth', attendees: 3000, image: 'https://images.unsplash.com/photo-1529070470440-9f3507b52243?w=400&h=240&fit=crop&crop=center', description: 'The north\'s largest gathering of tech innovators and businesses.' }
];

const initialNotifications = [
    { id: 1, type: 'invite', text: 'Sarah Johnson invited you to Marketing Summit 2025.', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false },
    { id: 2, type: 'update', text: 'Tech Conference 2025 has been updated.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false },
    { id: 3, type: 'rsvp', text: 'Mike Chen accepted your invite to Tech Conference 2025.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true },
];

// Reusable Components
const EventDetailsModal = ({ event, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{event.title}</h2>
                <button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="modal-body">
                {event.image && <img src={event.image} alt={event.title} className="modal-image" onError={(e) => { e.target.style.display = 'none'; }} />}
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Date & Time</div>
                            <div className="detail-value">{new Date(event.date).toLocaleDateString('en-GB')} at {event.time}</div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Location</div>
                            <div className="detail-value">{event.location}</div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1-1H5a1 1 0 0 1-1-1V8z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Description</div>
                            <div className="detail-value">{event.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const EditEventModal = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState(event);
    const [imagePreview, setImagePreview] = useState(event.image);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Event</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Event Title</label>
                                <input className="form-input" type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="date">Date</label>
                                    <input className="form-input" type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="time">Time</label>
                                    <input className="form-input" type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="location">Location</label>
                                <input className="form-input" type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Event Image</label>
                                <input type="file" id="image-upload-edit" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <label htmlFor="image-upload-edit" className="image-upload">
                                    Click to upload image
                                </label>
                                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea className="form-textarea" id="description" name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateEventPage = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', image: '', description: '' });
    const [imagePreview, setImagePreview] = useState('');
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: Date.now(), attendees: 0, status: 'upcoming' });
    };

    return (
        <main className="main-content">
            <div className="section-header">
                <h1 className="section-title page-title">Create New Event</h1>
                <button className="btn btn-outline" onClick={onCancel}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="card card-padded">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Event Title</label>
                        <input className="form-input" type="text" id="title" name="title" onChange={handleChange} placeholder="e.g., Summer Music Festival" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">Date</label>
                            <input className="form-input" type="date" id="date" name="date" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="time">Time</label>
                            <input className="form-input" type="time" id="time" name="time" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input className="form-input" type="text" id="location" name="location" onChange={handleChange} placeholder="e.g., Hyde Park, London" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Event Image</label>
                        <input type="file" id="image-upload-create" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <label htmlFor="image-upload-create" className="image-upload">
                            Click to upload image
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea className="form-textarea" id="description" name="description" onChange={handleChange} placeholder="Describe your event..." required />
                    </div>
                    <div className="modal-footer" style={{ padding: 0, borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Event</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText }) => (
    <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>{message}</p>
            </div>
            <div className="modal-footer" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <button onClick={onCancel} className="btn btn-outline">Cancel</button>
                <button onClick={onConfirm} className="btn btn-danger" style={{ color: 'white', backgroundColor: 'var(--danger-color)' }}>{confirmText}</button>
            </div>
        </div>
    </div>
);

const App = () => {
    const [myEvents, setMyEvents] = useState(initialMyEvents);
    const [attendingEvents, setAttendingEvents] = useState(initialAttendingEvents);
    const [allEvents, setAllEvents] = useState(initialAllEvents);
    const [notifications, setNotifications] = useState(initialNotifications);

    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('discover');
    const [currentView, setCurrentView] = useState('dashboard');
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [confirmingAction, setConfirmingAction] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    const handleCreateEvent = (newEvent) => {
        setMyEvents(prev => [{ ...newEvent, id: Date.now() }, ...prev]);
        setAllEvents(prev => [{ ...newEvent, id: Date.now() }, ...prev]);
        alert(`Event "${newEvent.title}" created successfully!`);
        setCurrentView('dashboard');
    };

    const handleUpdateEvent = (updatedEvent) => {
        setMyEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setAllEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        alert(`Event "${updatedEvent.title}" updated successfully!`);
        setEditingEvent(null);
    };

    const handleRsvp = (eventToRsvp) => {
        if (myEvents.some(e => e.id === eventToRsvp.id) || attendingEvents.some(e => e.id === eventToRsvp.id)) return;
        setAttendingEvents(prev => [...prev, { ...eventToRsvp, rsvpStatus: 'accepted' }]);
        alert(`You have successfully RSVP'd to "${eventToRsvp.title}"!`);
    };

    const handleCancelRsvp = (eventToLeave) => {
        setAttendingEvents(prev => prev.filter(e => e.id !== eventToLeave.id));
        setConfirmingAction(null);
    };

    const handleDeleteEvent = (eventToDelete) => {
        setMyEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setAllEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setConfirmingAction(null);
    };

    const clearFilters = () => {
        setLocationFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    const publicEvents = useMemo(() => {
        return allEvents.filter(event =>
            !myEvents.some(e => e.id === event.id) &&
            !attendingEvents.some(e => e.id === event.id)
        ).filter(event => {
            const keywordMatch = searchQuery === '' || event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
            const locationMatch = locationFilter === '' || event.location.toLowerCase().includes(locationFilter.toLowerCase());
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;
            const eventDate = new Date(event.date);
            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);
            const dateMatch = (!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate);
            return keywordMatch && locationMatch && dateMatch;
        });
    }, [allEvents, myEvents, attendingEvents, searchQuery, locationFilter, startDateFilter, endDateFilter]);

    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const unreadCount = notifications.filter(n => !n.read).length;

    const renderEventCard = (event) => {
        const isMyEvent = myEvents.some(e => e.id === event.id);
        const isAttending = attendingEvents.some(e => e.id === event.id);

        return (
            <div key={event.id} className="event-card">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="event-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x240/f8f9fa/9ca3af?text=No+Image'; }} />
                ) : (
                    <div className="event-image-placeholder">
                        <svg width="40" height="40" viewBox="0 0 16 16" fill="#9CA3AF">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.5 10.5l-2.777-2.947a.5.5 0 0 0-.577-.093L.002 9.5V3a1 1 0 0 1 1-1h12z" />
                        </svg>
                    </div>
                )}
                <div className="event-content">
                    <div>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-meta">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                        </div>
                        <div className="event-meta">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                            {event.location}
                        </div>
                    </div>
                    <div className="event-actions">
                        {isMyEvent ? (
                            <>
                                <button className="btn btn-secondary" onClick={() => setSelectedEvent(event)}>Details</button>
                                <button className="btn btn-primary" onClick={() => setEditingEvent(event)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => setConfirmingAction({ type: 'delete', event })}>Cancel</button>
                            </>
                        ) : isAttending ? (
                            <>
                                <button className="btn btn-danger" onClick={() => setConfirmingAction({ type: 'rsvp_cancel', event })}>Cancel RSVP</button>
                                <button className="btn" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }} onClick={() => setSelectedEvent(event)}>Details</button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={() => setSelectedEvent(event)}>Details</button>
                                <button className="btn btn-primary" onClick={() => handleRsvp(event)}>RSVP</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            <link rel="stylesheet" href="universal-styles.css" />


            {currentView === 'dashboard' ? (
                <main className="main-content">
                    <div className="card card-padded">
                        <div className="section-header">
                            <h2 className="section-title">Events</h2>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div className="search-box">
                                    <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                    <input type="text" placeholder="Search by keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                                </div>
                                <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>Filters</button>
                                <button className="btn btn-primary" onClick={() => setCurrentView('createEvent')}>Create Event</button>
                            </div>
                        </div>
                        {showFilters && (
                            <div className="filter-panel">
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="location">Location</label>
                                    <input type="text" id="location" className="form-input" placeholder="e.g. London" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="start-date">From</label>
                                    <input type="date" id="start-date" className="form-input" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="end-date">To</label>
                                    <input type="date" id="end-date" className="form-input" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                                </div>
                                <button className="btn btn-outline" onClick={clearFilters}>Clear</button>
                            </div>
                        )}
                        <div className="tabs">
                            <button className={`tab ${activeTab === 'discover' ? 'tab-active' : ''}`} onClick={() => setActiveTab('discover')}>Discover</button>
                            <button className={`tab ${activeTab === 'myEvents' ? 'tab-active' : ''}`} onClick={() => setActiveTab('myEvents')}>My Events</button>
                            <button className={`tab ${activeTab === 'attending' ? 'tab-active' : ''}`} onClick={() => setActiveTab('attending')}>Attending</button>
                        </div>
                        <div className="events-grid">
                            {activeTab === 'discover' && (
                                publicEvents.length > 0 ? publicEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>No events match your criteria.</p></div>
                            )}
                            {activeTab === 'myEvents' && (
                                myEvents.length > 0 ? myEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>You haven't created any events.</p></div>
                            )}
                            {activeTab === 'attending' && (
                                attendingEvents.length > 0 ? attendingEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>You are not attending any events.</p></div>
                            )}
                        </div>
                    </div>
                </main>
            ) : (
                <CreateEventPage onSave={handleCreateEvent} onCancel={() => setCurrentView('dashboard')} />
            )}

            {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {editingEvent && <EditEventModal event={editingEvent} onSave={handleUpdateEvent} onClose={() => setEditingEvent(null)} />}
            {confirmingAction && <ConfirmationModal
                title={confirmingAction.type === 'delete' ? 'Cancel Event' : 'Cancel RSVP'}
                message={confirmingAction.type === 'delete' ? `Are you sure you want to permanently cancel and delete "${confirmingAction.event.title}"? This action cannot be undone.` : `Are you sure you want to cancel your RSVP for "${confirmingAction.event.title}"?`}
                confirmText={confirmingAction.type === 'delete' ? 'Yes, Cancel Event' : 'Yes, Cancel RSVP'}
                onConfirm={() => confirmingAction.type === 'delete' ? handleDeleteEvent(confirmingAction.event) : handleCancelRsvp(confirmingAction.event)}
                onCancel={() => setConfirmingAction(null)}
            />}

        </div>
    );
};

export default App;