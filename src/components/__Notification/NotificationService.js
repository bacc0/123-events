import { getDatabase, ref as dbRef, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

class NotificationService {
    constructor() {
        this.db = getDatabase();
    }

    // Send a notification to a specific user
    async sendNotification(userId, notificationData) {
        try {
            const notificationsRef = dbRef(this.db, `notifications/${userId}`);
            const newNotificationRef = push(notificationsRef);
            
            const notification = {
                ...notificationData,
                timestamp: Date.now(),
                read: false,
                id: newNotificationRef.key
            };

            await set(newNotificationRef, notification);
            console.log('✅ Notification sent successfully');
            return newNotificationRef.key;
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            throw error;
        }
    }

    // Send RSVP notification to event organizer
    async sendRsvpNotification(eventId, eventTitle, organizerUid, rsvpUserName, type = 'rsvp') {
        const message = type === 'rsvp' 
            ? `${rsvpUserName} RSVP'd to ${eventTitle}.`
            : `${rsvpUserName} cancelled their RSVP to ${eventTitle}.`;

        return this.sendNotification(organizerUid, {
            type: type === 'rsvp' ? 'rsvp' : 'rsvp_cancelled',
            text: message,
            eventId,
            eventTitle,
            senderName: rsvpUserName
        });
    }

    // Send invitation notification
    async sendInvitationNotification(recipientUid, eventId, eventTitle, organizerName, hasEmail = false, recipientEmail = null) {
        const baseMessage = `${organizerName} invited you to "${eventTitle}".`;
        const message = hasEmail 
            ? `${baseMessage} Check your email (${this.maskEmail(recipientEmail)}) for full details and RSVP in the app.`
            : `${baseMessage} Open the app to see details and RSVP.`;

        return this.sendNotification(recipientUid, {
            type: 'invitation',
            text: message,
            eventId,
            eventTitle,
            organizerName,
            hasEmail,
            recipientEmail: hasEmail ? recipientEmail : null
        });
    }

    // Send invitation accepted notification to organizer
    async sendInvitationAcceptedNotification(organizerUid, eventId, eventTitle, accepterName) {
        return this.sendNotification(organizerUid, {
            type: 'invitation_accepted',
            text: `${accepterName} accepted your invitation to ${eventTitle}.`,
            eventId,
            eventTitle,
            senderName: accepterName
        });
    }

    // Send contact/message notification
    async sendContactNotification(recipientUid, senderName, message, hasEmail = false, senderEmail = null) {
        const baseMessage = `${senderName} sent you a message`;
        const fullMessage = hasEmail 
            ? `${baseMessage} about your events. Check your email (${this.maskEmail(senderEmail)}) for the full message.`
            : `${baseMessage}: "${message}"`;

        return this.sendNotification(recipientUid, {
            type: 'contact',
            text: fullMessage,
            fullMessage: message,
            senderName,
            hasEmail,
            senderEmail: hasEmail ? senderEmail : null
        });
    }

    // Send event update notification to all attendees
    async sendEventUpdateNotification(eventId, eventTitle, attendeeUids, updateMessage) {
        const promises = attendeeUids.map(uid => 
            this.sendNotification(uid, {
                type: 'update',
                text: `${eventTitle} has been updated. ${updateMessage}`,
                eventId,
                eventTitle
            })
        );

        try {
            await Promise.all(promises);
            console.log('✅ Event update notifications sent to all attendees');
        } catch (error) {
            console.error('❌ Error sending event update notifications:', error);
        }
    }

    // Send event cancellation notification to all attendees
    async sendEventCancellationNotification(eventId, eventTitle, attendeeUids) {
        const promises = attendeeUids.map(uid => 
            this.sendNotification(uid, {
                type: 'update',
                text: `${eventTitle} has been cancelled by the organizer.`,
                eventId,
                eventTitle
            })
        );

        try {
            await Promise.all(promises);
            console.log('✅ Event cancellation notifications sent to all attendees');
        } catch (error) {
            console.error('❌ Error sending event cancellation notifications:', error);
        }
    }

    // Send new event announcement (optional - for followers/interested users)
    async sendNewEventNotification(recipientUids, eventId, eventTitle, organizerName) {
        const promises = recipientUids.map(uid => 
            this.sendNotification(uid, {
                type: 'announcement',
                text: `${organizerName} created a new event: "${eventTitle}". Check it out!`,
                eventId,
                eventTitle,
                organizerName
            })
        );

        try {
            await Promise.all(promises);
            console.log('✅ New event notifications sent');
        } catch (error) {
            console.error('❌ Error sending new event notifications:', error);
        }
    }

    // Utility function to mask email addresses
    maskEmail(email) {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (username.length <= 2) return email;
        
        const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
        return `${maskedUsername}@${domain}`;
    }

    // Get current user info helper
    getCurrentUser() {
        const auth = getAuth();
        return auth.currentUser;
    }

    // Send notification to multiple users
    async sendBulkNotifications(userIds, notificationData) {
        const promises = userIds.map(uid => this.sendNotification(uid, notificationData));
        
        try {
            await Promise.all(promises);
            console.log('✅ Bulk notifications sent successfully');
        } catch (error) {
            console.error('❌ Error sending bulk notifications:', error);
            throw error;
        }
    }
}

// Export a singleton instance
const notificationService = new NotificationService();

// Helper functions for common use cases
export const sendRsvpNotification = (eventId, eventTitle, organizerUid, rsvpUserName) => {
    return notificationService.sendRsvpNotification(eventId, eventTitle, organizerUid, rsvpUserName, 'rsvp');
};

export const sendRsvpCancelledNotification = (eventId, eventTitle, organizerUid, rsvpUserName) => {
    return notificationService.sendRsvpNotification(eventId, eventTitle, organizerUid, rsvpUserName, 'rsvp_cancelled');
};

export const sendInvitationNotification = (recipientUid, eventId, eventTitle, organizerName, hasEmail, recipientEmail) => {
    return notificationService.sendInvitationNotification(recipientUid, eventId, eventTitle, organizerName, hasEmail, recipientEmail);
};

export const sendInvitationAcceptedNotification = (organizerUid, eventId, eventTitle, accepterName) => {
    return notificationService.sendInvitationAcceptedNotification(organizerUid, eventId, eventTitle, accepterName);
};

export const sendContactNotification = (recipientUid, senderName, message, hasEmail, senderEmail) => {
    return notificationService.sendContactNotification(recipientUid, senderName, message, hasEmail, senderEmail);
};

export const sendEventUpdateNotification = (eventId, eventTitle, attendeeUids, updateMessage) => {
    return notificationService.sendEventUpdateNotification(eventId, eventTitle, attendeeUids, updateMessage);
};

export const sendEventCancellationNotification = (eventId, eventTitle, attendeeUids) => {
    return notificationService.sendEventCancellationNotification(eventId, eventTitle, attendeeUids);
};

export default notificationService;