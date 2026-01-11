import React, { useEffect, useState } from 'react';

function DriverDashboard({ user }) {

    const [driverProfile, setDriverProfile] = useState(null);
    const [requests, setRequests] = useState([]); // Default to empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken');

    /* ---------------- FETCH FUNCTIONS ---------------- */

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch profile');
            }
            const data = await res.json();
            setDriverProfile(data);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch requests');
            }
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            // Don't block whole UI for requests failure, just log or show validation
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/driver/accept-request/${requestId}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Accept failed');

            alert('Job accepted');

            fetchProfile();
            fetchRequests();

        } catch (err) {
            alert(err.message || 'Something went wrong');
        }
    };

    const parkCar = async (ticketNo) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/park/${ticketNo}`, {
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/complete/${ticketNo}`, {
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
            setLoading(true);
            try {
                // If no token, maybe redirect? But preserving logic.
                if (token) {
                    await fetchProfile();
                    await fetchRequests();
                } else {
                    setError("No auth token found");
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load driver dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ---------------- UI ---------------- */

    if (loading) return <div className="container" style={{ padding: 20 }}>Loading driver details...</div>;
    if (error) return <div className="container" style={{ padding: 20, color: 'var(--error-color)' }}>Error: {error}</div>;
    if (!driverProfile || !driverProfile.user) return <div className="container">Driver profile not found.</div>;

    // Using CSS classes while keeping functional inline styles where absolutely necessary for specific overrides
    // Moving styles to class logic but keeping the structure

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2>Hello, {driverProfile.user.name}</h2>
            <div className="card">
                <p><strong>Status:</strong> <span style={{ color: driverProfile.status === 'AVAILABLE' ? 'var(--success-color)' : 'var(--warning-color)', fontWeight: 'bold' }}>{driverProfile.status}</span></p>
                <p><strong>Area:</strong> {driverProfile.parkingAreaId}</p>
                <p><strong>Today's Jobs:</strong> {driverProfile.dailyCount || 0}</p>
            </div>

            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

            {/* ERROR HANDLING: Guard driverProfile.activeRequest access completely */}
            {driverProfile.status !== 'AVAILABLE' && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Current Status</h3>
                    {driverProfile.activeRequest ? (
                        <div className="card" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                            <h4 style={{ color: '#0369a1' }}>Active Job: {driverProfile.activeRequest.requestType}</h4>
                            <p>Ticket: {driverProfile.activeRequest.ticketNo}</p>
                            <p>Car: {driverProfile.activeRequest.ticket?.cars?.plateNumber || 'See Ticket Details'}</p>

                            <div style={{ marginTop: '10px' }}>
                                {driverProfile.activeRequest.requestType === 'PARKING' ? (
                                    <button className="btn btn-primary" onClick={() => parkCar(driverProfile.activeRequest.ticketNo)}>
                                        PARK CAR
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => completeJob(driverProfile.activeRequest.ticketNo)}>
                                        COMPLETE RETRIEVAL
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="card" style={{ backgroundColor: '#fff3cd' }}>You are marked as BUSY but have no active request. Please contact admin.</p>
                    )}
                </div>
            )}

            <h3>Incoming Requests ({requests.length})</h3>

            {(!requests || requests.length === 0) && <p>No pending requests.</p>}

            <div className="grid">
                {(requests || []).map(req => (
                    <div key={req.id} className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
                        <div><b>Type:</b> {req.requestType}</div>
                        <div><b>Ticket:</b> {req.ticketNo}</div>
                        <div><b>Time:</b> {new Date(req.createdAt).toLocaleTimeString()}</div>

                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '10px' }}
                            onClick={() => acceptRequest(req.id)}
                        >
                            ACCEPT JOB
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DriverDashboard;

