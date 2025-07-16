import React, { useEffect, useState, useMemo } from "react";

function Dashboard({ allEvents }) {
    const [searchQuery, setSearchQuery] = useState("");

    const publicEvents = useMemo(() => {
        return allEvents.filter(event => {
            return searchQuery === "" ||
                (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
        });
    }, [allEvents, searchQuery]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul>
                {publicEvents.map(event => (
                    <li key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;