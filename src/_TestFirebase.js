import React, { useEffect } from "react";
import { getDatabase, ref, get, child } from "firebase/database";
import { app } from "./firebase"; // re-use the existing app

const database = getDatabase(app);

function TestFirebase() {
     useEffect(() => {
          const fetchEvents = async () => {
               console.log("🔎 Starting to fetch events from Realtime Database...");
               try {
                    const dbRef = ref(database);
                    const snapshot = await get(child(dbRef, "events"));
                    if (snapshot.exists()) {
                         const data = snapshot.val();
                         console.log("✅ Events data from Realtime DB:", data);
                    } else {
                         console.log("⚠️ No data available in 'events'.");
                    }
               } catch (error) {
                    console.error("❌ Error fetching events:", error);
               }
          };

          fetchEvents();
     }, []);

     return (
          <div>
               <h2>Test Realtime Database Fetch</h2>
               <p>Check your console for results!</p>
          </div>
     );
}

export default TestFirebase;