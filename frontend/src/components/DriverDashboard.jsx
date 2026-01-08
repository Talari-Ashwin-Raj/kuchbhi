import React from 'react';

function DriverDashboard({ user, driverProfile, requests, onAccept }) {

    // Derived state for the "Active Job" could be passed in, but strictly requests are "PENDING".
    // If a driver accepts, it moves to their active list. 
    // For this mock, we assume the parent filters requests.

    const styles = {
        container: { padding: '20px' },
        requestCard: {
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            animation: 'pulse 2s infinite'
        },
        button: { padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        info: { marginBottom: '5px' }
    };

    if (driverProfile?.status !== 'AVAILABLE') {
        // Simple View for Busy Driver
        return (
            <div style={styles.container}>
                <h3>Driver Dashboard</h3>
                <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
                    <h4>Status: {driverProfile?.status}</h4>
                    <p>You have an active job. Please complete it to see new requests.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3>Hello, {user.name}</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>Status: {driverProfile?.status} | Area ID: {driverProfile?.parkingAreaId}</p>

            <hr />
            <h4>Incoming Requests ({requests.length})</h4>

            {requests.length === 0 ? (
                <p>No pending requests in your area.</p>
            ) : (
                requests.map(req => (
                    <div key={req.id} style={styles.requestCard}>
                        <div style={styles.info}><strong>Type:</strong> {req.requestType}</div>
                        <div style={styles.info}><strong>Ticket:</strong> {req.ticketNo}</div>
                        <div style={styles.info}><strong>Time:</strong> {new Date(req.createdAt).toLocaleTimeString()}</div>
                        <button
                            style={styles.button}
                            onClick={() => onAccept(req.id, user.id)}
                        >
                            ACCEPT JOB
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default DriverDashboard;
