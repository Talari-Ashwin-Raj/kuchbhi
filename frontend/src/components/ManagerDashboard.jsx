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

    if (!managerData) return <div className="container" style={{ padding: 20 }}>Loading manager dashboard...</div>;

    if (!managerData.area) {
        return (
            <div className="container" style={{ padding: 20 }}>
                <h3>Welcome {user?.name}</h3>
                <p>Status: {managerData.status}</p>
                <div className="card" style={{ marginTop: 20, backgroundColor: '#fff3cd' }}>
                    <p>No parking area assigned yet. Please contact Super Admin.</p>
                </div>
            </div>
        );
    }

    const area = managerData.area;

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2>{area.name}</h2>
            <div className="card" style={{ marginBottom: '20px' }}>
                <p><b>Location:</b> {area.location}</p>
                <p><b>Rate:</b> ₹{area.amount}/hr</p>
                <p><b>Status:</b> {managerData.status}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Drivers</h3>
                <button className="btn btn-primary" onClick={() => setShowAddDriver(!showAddDriver)}>
                    {showAddDriver ? 'Cancel' : 'Request New Driver'}
                </button>
            </div>

            {showAddDriver && (
                <div className="card" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                    <h4>New Driver Request</h4>
                    <form onSubmit={submitDriverRequest} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input className="input" placeholder="Name" required onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} style={{ padding: '10px' }} />
                        <input className="input" placeholder="Email" required onChange={e => setNewDriver({ ...newDriver, email: e.target.value })} style={{ padding: '10px' }} />
                        <input className="input" placeholder="Password" required type="password" onChange={e => setNewDriver({ ...newDriver, password: e.target.value })} style={{ padding: '10px' }} />
                        <input className="input" placeholder="DL Number" required onChange={e => setNewDriver({ ...newDriver, dlNumber: e.target.value })} style={{ padding: '10px' }} />
                        <button className="btn btn-primary" type="submit">Send Request</button>
                    </form>
                </div>
            )}

            {(!area.drivers || area.drivers.length === 0) && <p>No drivers assigned yet.</p>}

            <div className="grid">
                {area.drivers?.map(d => (
                    <div key={d.userId} className="card">
                        <div style={{ fontWeight: 'bold' }}>{d.user?.name || 'Unknown Driver'}</div>
                        <div>Status: <span style={{ color: d.status === 'AVAILABLE' ? 'var(--success-color)' : 'var(--warning-color)', fontWeight: 'bold' }}>{d.status}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManagerDashboard;
