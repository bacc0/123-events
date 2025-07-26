import React, { useState, useRef } from 'react';

import { getDatabase, ref, push, set } from "firebase/database";
import { get as dbGet } from "firebase/database";

import { Button, IconButton, } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import emailjs from '@emailjs/browser';

import ContactUs from './ContactUs';

const ContactOrganizerModal = ({ organizerName, organizerUid, onClose }) => {

    const [senderName, setSenderName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [message, setMessage] = useState('');

    const getEmailFromUid = async (uid) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await dbGet(userRef);
        const userData = snapshot.val();
        return userData?.email || null;
    };


    // const EmailJS_service = (message, organizerEmail, senderEmail, senderName) => {

    //     alert('message: ', message)
    //     alert('organizerEmail: ', organizerEmail)
    //     alert('senderEmail: ', senderEmail)
    //     alert('senderName: ', senderName)


    //     const form = useRef();

    //     const sendEmail = (e) => {
    //         e.preventDefault();

    //         // {{message}}   {{from_email=senderEmail}}   {from_name=senderName}}   {{to_name=organizerEmail}}


    //         emailjs
    //             .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, {
    //                 publicKey: 'YOUR_PUBLIC_KEY',
    //             })
    //             .then(
    //                 () => {
    //                     console.log('SUCCESS!');
    //                 },
    //                 (error) => {
    //                     console.log('FAILED...', error.text);
    //                 },
    //             );
    //     };

    //     return (
    //         <form ref={form} onSubmit={sendEmail}>
    //             <label>Name</label>
    //             <input type="text" name="user_name" />
    //             <label>Email</label>
    //             <input type="email" name="user_email" />
    //             <label>Message</label>
    //             <textarea name="message" />
    //             <input type="submit" value="Send" />
    //         </form>
    //     );
    // };




    const handleSubmit_EmailJS = async (message, organizerEmail, senderEmail, senderName) => {
        try {
            const templateParams = {
                message: message,
                to_email: organizerEmail,   // or whatever variable name you use in EmailJS template
                from_email: senderEmail,
                from_name: senderName,
            };

            // Call emailjs.send (not sendForm)
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                templateParams,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            )


            alert("✅ Email.js sent successfully! ✉️");


            // You can later use EmailJS or other APIs here

            <ContactUs />




        } catch (error) {
            console.error("EmailJS error:", error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!organizerUid) {
            console.error("❌ organizerUid is missing");
            alert("Organizer UID is missing. Cannot send message.");
            return;
        }

        try {
            const db = getDatabase();
            const notificationRef = ref(db, `notifications/${organizerUid}`);
            const newNotificationRef = push(notificationRef);
            const timestamp = Date.now();

            await set(newNotificationRef, {
                id: newNotificationRef.key,
                read: false,
                type: "contact",
                text: `${senderName} sent you a message`,
                timestamp,
                senderName,
                senderEmail,
                message
            });

            // ✅ Fetch the organizer's email using UID
            const organizerEmail = await getEmailFromUid(organizerUid);

            // ✅ Call your custom handler
            await (
                handleSubmit_EmailJS(message, organizerEmail, senderEmail, senderName)
            )

            // alert("✅ Your message was sent successfully!");
        } catch (error) {
            console.error("Notification error:", error);
            alert("❌ Something went wrong. Please try again.");
            console.error("❌ Full error details:", error.message, error);
        }

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} >
            <div
                className="modal-content"
                style={{ maxWidth: "500px", padding: '0 30px', borderRadius: 16 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">

                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >

                        <h1
                            style={{
                                textAlign: "center",
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                color: '#455a64',
                                marginBottom: 35,
                                position: 'relative',
                                left: 40,
                                // background: 'red',
                                minWidth: '120%'
                            }}
                        >
                            {`Contact ${organizerName}`}

                        </h1>
                    </div>


                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div style={{ padding: 32 }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>



                            <label
                                htmlFor="fullName"
                                style={{ fontSize: 14, color: "#78909C" }}
                            >
                                Your Name
                            </label>

                            <input
                                type="text"
                                id="senderName"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                required
                                placeholder="e.g. John Doe"

                                style={{
                                    borderRadius: 16,
                                    width: '100%',
                                    border: "1px solid #CFD8DD",
                                    padding: 20,
                                    marginTop: 12,
                                    marginBottom: 17,
                                    fontSize: 14,
                                    lineHeight: "1.42",
                                    height: 30,
                                }}

                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>

                            <label
                                htmlFor="fullName"
                                style={{ fontSize: 14, color: "#78909C" }}
                            >
                                Your Email
                            </label>

                            <input
                                type="email"
                                id="senderEmail"
                                value={senderEmail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                required
                                placeholder="e.g. yourname@email.com"

                                style={{
                                    borderRadius: 16,
                                    width: '100%',
                                    border: "1px solid #CFD8DD",
                                    padding: 20,
                                    marginTop: 12,
                                    marginBottom: 17,
                                    fontSize: 14,
                                    lineHeight: "1.42",
                                    height: 30,
                                }}

                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label
                                htmlFor="fullName"
                                style={{ fontSize: 14, color: "#78909C" }}
                            >
                                Message
                            </label>

                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                required

                                style={{
                                    borderRadius: 16,
                                    width: '100%',
                                    height: 97,
                                    border: "1px solid #CFD8DD",
                                    padding: 20,
                                    marginTop: 12,
                                    marginBottom: 17,
                                    fontSize: 14,
                                    lineHeight: "1.42"
                                }}


                            />
                        </div>
                        <div
                            style={{
                                textAlign: 'center'
                            }}
                        >

                            <Button
                                type="submit"
                                variant="contained"
                                style={{
                                    borderRadius: 8,
                                    background: "#0A47A3",
                                    color: "#ffffff",
                                    height: 35,
                                    minWidth: 190,
                                    marginBottom: 12,
                                    marginTop: 18,
                                }}
                                endIcon={<ForwardToInboxOutlinedIcon />}
                            >
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactOrganizerModal;
