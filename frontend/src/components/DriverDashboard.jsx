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

    const parkCar = async (ticketNo) => {
        try {
            const res = await fetch(`http://localhost:5001/api/driver/park/${ticketNo}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to park');
            alert('Car Parked!');
            fetchProfile();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const completeJob = async (ticketNo) => {
        try {
            const res = await fetch(`http://localhost:5001/api/driver/complete/${ticketNo}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to complete');
            alert('Job Completed! Car Retrieved.');
            fetchProfile();
            fetchRequests();
        } catch (err) { alert(err.message); }
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

                {driverProfile.activeRequest && (
                    <div style={{ padding: 20, backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 8 }}>
                        <h4>Active Job: {driverProfile.activeRequest.requestType}</h4>
                        <p>Ticket: {driverProfile.activeRequest.ticketNo}</p>
                        <p>Car: {driverProfile.activeRequest.ticket?.cars?.plateNumber || 'See Ticket Details'}</p>

                        {driverProfile.activeRequest.requestType === 'PARKING' ? (
                            <button style={styles.button} onClick={() => parkCar(driverProfile.activeRequest.ticketNo)}>
                                PARK CAR
                            </button>
                        ) : (
                            <button style={styles.button} onClick={() => completeJob(driverProfile.activeRequest.ticketNo)}>
                                COMPLETE RETRIEVAL
                            </button>
                        )}
                    </div>
                )}

                {!driverProfile.activeRequest && <p>You are marked as BUSY but have no active request. Please contact admin.</p>}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3>Hello, {driverProfile.user.name}</h3>
            <p>Status: {driverProfile.status}</p>
            <p>Area: {driverProfile.parkingAreaId}</p>
            <p>Today's Jobs: <b>{driverProfile.dailyCount || 0}</b></p>

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

