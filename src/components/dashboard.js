// This component displays the dashboard page with event filters, tabs, and event cards.
import React, { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Typography,
    Button,
    Box,
    TextField,
    InputAdornment,
    Paper,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Divider,
    useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";

export default function Dashboard() {
    const [fromDate, setFromDate] = useState(dayjs('2025-07-02'));
    const [toDate, setToDate] = useState(dayjs('2025-07-30'));
    const [tabValue, setTabValue] = useState(0);

    const isSmallScreen = useMediaQuery('(max-width:839px)');

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 2, mb: 3, borderRadius: "12px", boxShadow: 0, backgroundColor: "#F5F5F5" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        Events
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, justifyContent: 'center' }}>
                        <TextField
                            placeholder="Search by keyword..."
                            size="medium"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                height: 56,
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                marginBottom: 2,
                                width: { xs: '100%', sm: '246px' }
                            }}
                        />
                        <TextField
                            placeholder="e.g. London"
                            label="Location"
                            size="medium"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOnIcon />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                height: 56,
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                marginBottom: 2,
                                width: { xs: '100%', sm: '246px' }
                            }}
                        />
                        <span
                            style={{
                                background: '#ffffff',
                                borderRadius: 3,
                                height: 56,
                                marginBottom: '16px',

                            }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From"
                                    value={fromDate}
                                    onChange={(newValue) => setFromDate(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            sx={{
                                                height: 56,
                                                borderRadius: "8px",
                                                width: { xs: '100%', sm: 'auto' }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </span>
                        <span style={{ background: '#ffffff', borderRadius: 3, height: 56 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="To"
                                    value={toDate}
                                    onChange={(newValue) => setToDate(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            sx={{
                                                height: 40,
                                                width: { xs: '100%', sm: 'auto' }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </span>

                        {isSmallScreen ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    width: "100%",
                                    gap: 1,
                                    mt: 1
                                }}
                            >
                                <Button variant="outlined"
                                    sx={{
                                        borderColor: "#003E99",
                                        color: "#003E99",
                                        flex: 1,
                                        borderRadius: "8px",
                                        minWidth: 0,
                                        marginBottom: 1.5,
                                        marginTop: 1,
                                        padding: "10px",
                                        width: { xs: '75%', sm: '507px' }
                                    }}

                                >Filters</Button>
                                <Button variant="outlined" color="error" sx={{
                                    flex: 1,
                                    borderRadius: "8px",
                                    minWidth: 0,
                                    marginBottom: 1.5,
                                    marginTop: 1,
                                    padding: "10px",
                                    width: { xs: '75%', sm: '507px' }
                                }}>Clear</Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        flex: 1,
                                        borderRadius: "8px",
                                        minWidth: 0,
                                        bgcolor: "#003E99",
                                        "&:hover": {
                                            bgcolor: "#0052CC"
                                        },
                                        marginBottom: 1.5,
                                        marginTop: 1,
                                        padding: "10px",
                                        width: { xs: '75%', sm: '507px' }
                                    }}
                                >
                                    Create Event
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "space-between",
                                        gap: "16px"
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            height: 40,
                                            width: 160,
                                            borderRadius: "8px",
                                            borderColor: "#003E99",
                                            color: "#003E99",
                                        }}
                                    >
                                        Filters
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ height: 40, width: 160, borderRadius: "8px" }}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: 40,
                                            width: 160,
                                            borderRadius: "8px",
                                            bgcolor: "#003E99",
                                            "&:hover": {
                                                bgcolor: "#0052CC"
                                            },
                                        }}
                                    >
                                        Create Event
                                    </Button>
                                </div>
                            </>
                        )}
                    </Box>
                </Paper>

                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        mb: 3,
                    }}
                >
                    <Tab label="Discover" />
                    <Tab label="My Events" />
                    <Tab label="Attending" />
                </Tabs>

                {tabValue === 0 && (
                    <Grid container spacing={2} justifyContent="center">
                        {[1, 2, 3].map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        transition: "all 0.3s ease",
                                        boxShadow: 1,
                                        "&:hover": {
                                            boxShadow: 3,
                                            transform: "translateY(-3px)"
                                        },
                                        maxWidth: 388,
                                        margin: isSmallScreen ? "auto" : undefined
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="258"
                                        image="https://images.unsplash.com/photo-1663680942106-883c2e50c05f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Event image"
                                        sx={{
                                            borderTopLeftRadius: "12px",
                                            borderTopRightRadius: "12px"
                                        }}
                                    />
                                    <CardContent>
                                        <Typography
                                            style={{
                                                position: "relative",
                                                top: "-198px",
                                                marginTop: -60,
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                textShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                                                color: "#ffffff",
                                                background: `linear-gradient(to right, transparent,transparent, #00000011, transparent, transparent)`,
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                textAlign: "center",
                                                backdropFilter: 'blur(6px)',
                                                WebkitBackdropFilter: 'blur(6px)',
                                            }}
                                            variant="h6" sx={{ mb: 1 }}>
                                            Event Title {item}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="body2">20 July</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="body2">Hyde Park, London</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 1
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    flex: 1,
                                                    height: 40,
                                                    borderRadius: "8px",
                                                    minWidth: 0,
                                                    borderColor: "#003E99",
                                                    color: "#003E99",
                                                    marginBottom: -1.5,
                                                }}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    flex: 1,
                                                    height: 40,
                                                    borderRadius: "8px",
                                                    minWidth: 0,
                                                    bgcolor: "#003E99",
                                                    "&:hover": {
                                                        bgcolor: "#0052CC"
                                                    },
                                                    marginBottom: -1.5,
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{
                                                    flex: 1,
                                                    height: 40,
                                                    borderRadius: "8px",
                                                    minWidth: 0,
                                                    marginBottom: -1.5,
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Typography variant="body1">These are your events.</Typography>
                )}

                {tabValue === 2 && (
                    <Typography variant="body1">Events you are attending.</Typography>
                )}
            </Box>
        </Box >
    );
}