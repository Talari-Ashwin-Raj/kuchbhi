import React, { useEffect, useState } from 'react';

function DriverDashboard({ user }) {

    const [driverProfile, setDriverProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('authToken');

    /* ---------------- FETCH FUNCTIONS ---------------- */

    const fetchProfile = async () => {
        const res = await fetch('http://localhost:5001/api/driver/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDriverProfile(data);
    };

    const fetchRequests = async () => {
        const res = await fetch('http://localhost:5001/api/driver/requests', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRequests(data);
    };

    const acceptRequest = async (requestId) => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/driver/accept-request/${requestId}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert('Job accepted');

            fetchProfile();
            fetchRequests();

        } catch (err) {
            alert(err.message);
        }
    };

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        const load = async () => {
            try {
                await fetchProfile();
                await fetchRequests();
            } catch (err) {
                console.error(err);
                alert('Failed to load driver dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ---------------- UI ---------------- */

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    const styles = {
        container: { padding: '20px' },
        requestCard: {
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px'
        },
        button: {
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    if (driverProfile.status !== 'AVAILABLE') {
        return (
            <div style={styles.container}>
                <h3>Driver Dashboard</h3>
                <p>Status: {driverProfile.status}</p>
                <p>You are currently busy.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3>Hello, {driverProfile.user.name}</h3>
            <p>Status: {driverProfile.status}</p>
            <p>Area: {driverProfile.parkingAreaId}</p>

            <hr />

            <h4>Incoming Requests ({requests.length})</h4>

            {requests.length === 0 && <p>No pending requests.</p>}

            {requests.map(req => (
                <div key={req.id} style={styles.requestCard}>
                    <div><b>Type:</b> {req.requestType}</div>
                    <div><b>Ticket:</b> {req.ticketNo}</div>
                    <div><b>Time:</b> {new Date(req.createdAt).toLocaleTimeString()}</div>

                    <button
                        style={styles.button}
                        onClick={() => acceptRequest(req.id)}
                    >
                        ACCEPT JOB
                    </button>
                </div>
            ))}
        </div>
    );
}

export default DriverDashboard;

