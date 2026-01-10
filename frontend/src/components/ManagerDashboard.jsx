import React, { useEffect, useState } from 'react';

function ManagerDashboard({ user }) {
    const [managerData, setManagerData] = useState(null);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: '', email: '', password: '', dlNumber: '' });

    const token = localStorage.getItem('authToken');

    const fetchDashboard = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/manager/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Unauthorized');

            const data = await res.json();
            setManagerData(data);
        } catch (err) {
            console.error(err);
            alert('Session expired. Please login again.');
            localStorage.clear();
            window.location.href = '/';
        }
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
            return;
        }
        fetchDashboard();
    }, []);

    const submitDriverRequest = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/manager/request-driver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newDriver)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            alert('Driver request sent to Super Admin');
            setNewDriver({ name: '', email: '', password: '', dlNumber: '' });
            setShowAddDriver(false);
            fetchDashboard();
        } catch (err) {
            alert(err.message || 'Failed to send request');
        }
    };

    if (!managerData) return <p>Loading...</p>;

    if (!managerData.area) {
        return (
            <div>
                <h3>Welcome {user.name}</h3>
                <p>Status: {managerData.status}</p>
                <p>No parking area assigned yet.</p>
            </div>
        );
    }

    const area = managerData.area;

    return (
        <div style={{ padding: 20 }}>
            <h3>{area.name}</h3>
            <p><b>Location:</b> {area.location}</p>
            <p><b>Rate:</b> ₹{area.amount}</p>

            <h4>Drivers</h4>

            {(!area.drivers || area.drivers.length === 0) && <p>No drivers yet.</p>}

            {area.drivers?.map(d => (
                <div key={d.userId} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 6 }}>
                    {d.user?.name} – {d.status}
                </div>
            ))}

            <button onClick={() => setShowAddDriver(!showAddDriver)}>
                {showAddDriver ? 'Cancel' : 'Request New Driver'}
            </button>

            {showAddDriver && (
                <form onSubmit={submitDriverRequest} style={{ marginTop: 10 }}>
                    <input placeholder="Name" required onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} />
                    <input placeholder="Email" required onChange={e => setNewDriver({ ...newDriver, email: e.target.value })} />
                    <input placeholder="Password" required type="password" onChange={e => setNewDriver({ ...newDriver, password: e.target.value })} />
                    <input placeholder="DL Number" required onChange={e => setNewDriver({ ...newDriver, dlNumber: e.target.value })} />
                    <button type="submit">Send Request</button>
                </form>
            )}
        </div>
    );
}

export default ManagerDashboard;
