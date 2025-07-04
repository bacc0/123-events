import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

export default function GifPage() {
    const [highQualityLoaded, setHighQualityLoaded] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const navigate = useNavigate();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const img = new Image();
        img.src = "/your-animation_2.gif";
        img.onload = () => {
            setHighQualityLoaded(true);
        };

        const timer = setTimeout(() => {
            setShowTitle(true);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: "relative", height: "100vh", overflow: "hidden",
            background: '#003E99'
        }}>
            <img
                src={
                    highQualityLoaded ? "/your-animation_2.png" : "/your-animation_2.png"
                }
                alt="Animated background"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: highQualityLoaded ? "blur(0px)" : "blur(105px)",
                    transform: highQualityLoaded ? "scale(1)" : "scale(2)",
                    transition: "filter 2s ease, transform 2.4s ease",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(180deg,
               #003E99 0%,
               #003E9977 25%,
               #3399ff00 50%,
               #003E9955 75%,
               #003E9999 100%`,
                }}
            />

            <motion.h1
                initial={{ scale: 1.8, opacity: 0, y: -60 }}
                animate={showTitle ? { scale: 1, opacity: 1, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 270 }}
                style={{
                    position: "absolute",
                    top: isSmallScreen ? "13%" : "12%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold",
                    color: "#ffffff",
                    textShadow: "0px 0px 17px rgba(0, 28, 71, 0.88)",
                    textAlign: "center",
                    paddingLeft: "10%",
                    paddingRight: "10%",
                    margin: 0,
                    fontSize: isSmallScreen ? "2.7rem" : "4.5rem",
                    zIndex: 1,
                }}
            >
                Discover and Manage Your Events Easily
            </motion.h1>

            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    textAlign: "center",
                }}
            >
                <motion.div
                    initial={{ scale: 0.3, opacity: 0, y: -40 }}
                    animate={showTitle ? { scale: 1, opacity: 1, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 270, delay: 0.26 }}
                >
                    <Button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "12px 67px",
                            fontSize: "18px",
                            borderRadius: "8px",
                            border: "1px solid #003E99",
                            backgroundColor: "#ffffff",
                            color: "#003E99",
                            cursor: "pointer",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                        }}
                    >
                        Login
                    </Button>
                    <div style={{ minHeight: 28 }} />
                    <Button
                        onClick={() => navigate("/signup")}
                        style={{
                            padding: "12px 48px",
                            fontSize: "18px",
                            borderRadius: "8px",
                            border: "1px solid #003E99",
                            backgroundColor: "#ffffff",
                            color: "#003E99",
                            cursor: "pointer",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                        }}
                    >
                        Register
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}