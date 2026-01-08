import React, { useState } from 'react';

function ManagerDashboard({ user, managerInfo, parkingArea, onAddDriver, onNavigate }) {
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: '', email: '', password: '', dlNumber: '' });

    const handleAddDriverSubmit = (e) => {
        e.preventDefault();
        onAddDriver(newDriver, parkingArea.id);
        setShowAddDriver(false);
        setNewDriver({ name: '', email: '', password: '', dlNumber: '' });
        alert("Driver addition requested! Super Admin must approve.");
    };

    const styles = {
        container: { padding: '20px' },
        card: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
        button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' },
        input: { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }
    };

    if (!parkingArea) {
        return (
            <div style={styles.container}>
                <h3>Welcome, {user.name}</h3>
                <div style={styles.card}>
                    <p>Status: {managerInfo?.status}</p>
                    <p>You are not assigned to any Parking Area yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3>Parking Manager: {parkingArea.name}</h3>

            <div style={styles.card}>
                <h4>Your Area Details</h4>
                <p><strong>Location:</strong> {parkingArea.location}</p>
                <p><strong>QR Code ID:</strong> {parkingArea.qrCode}</p>
                <p><strong>Hourly Rate:</strong> ${parkingArea.amount}</p>
            </div>

            <button style={styles.button} onClick={() => setShowAddDriver(!showAddDriver)}>
                {showAddDriver ? 'Cancel' : 'Add New Driver'}
            </button>

            {showAddDriver && (
                <div style={{ ...styles.card, marginTop: '10px', border: '1px solid #007bff' }}>
                    <h4>Register New Driver</h4>
                    <form onSubmit={handleAddDriverSubmit}>
                        <input
                            style={styles.input}
                            placeholder="Name"
                            value={newDriver.name}
                            onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="Email"
                            type="email"
                            value={newDriver.email}
                            onChange={e => setNewDriver({ ...newDriver, email: e.target.value })}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="Password"
                            type="password"
                            value={newDriver.password}
                            onChange={e => setNewDriver({ ...newDriver, password: e.target.value })}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="DL Number"
                            value={newDriver.dlNumber}
                            onChange={e => setNewDriver({ ...newDriver, dlNumber: e.target.value })}
                            required
                        />
                        <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>Submit Request</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ManagerDashboard;
