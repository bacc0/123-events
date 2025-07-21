import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAuth, updatePassword, signOut } from "firebase/auth";
import UpdateIcon from "@mui/icons-material/Update";
import LogoutIcon from "@mui/icons-material/Logout";

const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "#E5E7EB" };

    const hasMinLength = password.length >= 7;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (hasMinLength && hasUppercase && hasLowercase) {
        return { strength: 3, text: "Good", color: "#26a69a" };
    } else {
        return { strength: 1, text: "Weak", color: "#e91e63" };
    }
};

const ModalEditPassword = ({ open, onClose }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showLogout, setShowLogout] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const strength = getPasswordStrength(newPassword);

    useEffect(() => {
        if (message.includes("Password changed")) {
            const timer = setTimeout(() => {
                onClose();
                setMessage("");
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            setMessage("✅ Password changed!");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                setShowLogout(true);
            }
            setMessage( error.message);
        }
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            window.location.reload();
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                style: {
                    borderRadius: 16,
                    padding: "60px 0px",
                },
            }}
        >
            <DialogTitle
                style={{
                    fontWeight: 600,
                    fontSize: 22,
                    color: "#37474F",
                    textAlign: "center",
                    paddingBottom: 0,
                }}
            >
                Update Password
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{ padding: 16 }}>
                 
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >

                        <div
                            style={{
                                position: "relative",
                                textAlign: "center",
                                width: 300,
                            }}
                        >
                            <div style={{ textAlign: "start" }} >
                                <label
                                    style={{
                                        fontSize: 14,
                                        color: "rgb(120, 144, 156)",
                                        marginBottom: 4,
                                        marginLeft: 12
                                    }}
                                >
                                    New Password
                                </label>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Create a strong password"
                                style={{
                                    fontSize: 14,
                                    color: "rgb(33, 33, 33)",
                                    fontWeight: 500,
                                    width: "100%",
                                    padding: "10px 40px 10px 12px",
                                    border: "1px solid #CFD8DD",
                                    borderRadius: 16,
                                    marginBottom: 6,
                                    marginTop: 12,
                                    height: 42,
                                    width: 280,
                                }}
                            />
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 50,
                                    transform: "translateY(-50%)",
                                    color: "#cfd8dc",
                                }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </div>

                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: strength.color,
                            marginBottom: 10,
                            textAlign: 'center'
                        }}
                    >
                        {strength.text}
                    </div>

                 
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                textAlign: "center",
                                width: 300,
                            }}
                        >
                            <div style={{ textAlign: "start" }} >
                                <label
                                    style={{
                                        fontSize: 14,
                                        color: "rgb(120, 144, 156)",
                                        marginBottom: 4,
                                        fontWeight: 400,
                                        marginLeft: 12
                                    }}
                                >
                                    Confirm Password
                                </label>
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                style={{
                                    fontSize: 14,
                                    color: "rgb(33, 33, 33)",
                                    fontWeight: 500,
                                    width: "100%",
                                    padding: "10px 40px 10px 12px",
                                    border: "1px solid #CFD8DD",
                                    borderRadius: 16,

                                    height: 42,
                                    width: 280,
                                    marginTop: 12,
                                }}
                            />
                            <IconButton
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 50,
                                    transform: "translateY(-50%)",
                                    color: "#cfd8dc",
                                }}
                            >
                                {showConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <Button
                            onClick={handleChangePassword}
                            variant="contained"
                            endIcon={<UpdateIcon />}
                            style={{
                                borderRadius: 8,
                                background: "#0A47A3",
                                color: "#ffffff",
                                height: 35,
                                minWidth: 190,
                                fontWeight: 400,
                                marginTop: 48,
                                marginBottom: 22,
                            }}
                        >
                            Update Password
                        </Button>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p
                            style={{
                                marginTop: 24,
                                fontSize: 14,
                                color: "#f48fb1",
                            }}
                        >
                        
                            {message}
                        </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        {showLogout && (
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                endIcon={<LogoutIcon />}
                                style={{
                                    marginTop: 10,
                                    height: 35,
                                    minWidth: 190,
                                    borderColor: "#ec407a",
                                    color: "#ec407a",
                                    borderRadius: 8,
                                }}
                            >
                                Log out and sign in again
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ModalEditPassword;
