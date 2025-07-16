import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function EventList() {
     const [events, setEvents] = useState([]);

     useEffect(() => {
          const fetchEvents = async () => {
               try {
                    const querySnapshot = await getDocs(collection(db, "events"));
                    const eventsData = querySnapshot.docs.map(doc => ({
                         id: doc.id,
                         ...doc.data()
                    }));
                    setEvents(eventsData);
               } catch (error) {
                    console.error("Error fetching events:", error);
               }
          };

          fetchEvents();
     }, []);

     return (
          <div>
               <h2>Event List</h2>
               {events.map(event => (
                    <div key={event.id}>
                         <h3>{event.name}</h3>
                         <p>{event.date}</p>
                         <p>{event.location}</p>
                         <p>{event.description}</p>
                         <hr />
                    </div>
               ))}
          </div>
     );
}

export default EventList;