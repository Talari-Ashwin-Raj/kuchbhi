import React, { useEffect, useState } from 'react';

function SuperAdminDashboard() {
    const [activeTab, setActiveTab] = useState('AREAS');

    const [parkingAreas, setParkingAreas] = useState([]);
    const [managers, setManagers] = useState([]);
    const [pendingDrivers, setPendingDrivers] = useState([]);

    const [loadingAreas, setLoadingAreas] = useState(true);
    const [loadingManagers, setLoadingManagers] = useState(true);

    const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
    const [newArea, setNewArea] = useState({ name: '', location: '', qrCode: '', amount: '', managerId: '' });

    const token = localStorage.getItem('authToken');

    /* ---------------- API CALLS ---------------- */

    const fetchParkingAreas = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/superAdmin/parking-areas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setParkingAreas(data);
        } catch (err) {
            console.error('Fetch parking areas failed', err);
        } finally {
            setLoadingAreas(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/superAdmin/managers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setManagers(data);
        } catch (err) {
            console.error('Fetch managers failed', err);
        } finally {
            setLoadingManagers(false);
        }
    };

    const fetchPendingDrivers = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/superadmin/pending-drivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPendingDrivers(data);
        } catch (err) {
            console.error('Pending drivers fetch failed', err);
            alert('Failed to load pending drivers');
        }
    };

    const addManager = async () => {
        if (!newManager.name || !newManager.email || !newManager.password) {
            alert('Fill all fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:5001/api/superAdmin/managers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newManager)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNewManager({ name: '', email: '', password: '' });
            fetchManagers();
        } catch (err) {
            alert(err.message || 'Failed to add manager');
        }
    };

    const createParkingArea = async () => {
        if (!newArea.name || !newArea.location || !newArea.qrCode || !newArea.amount || !newArea.managerId) {
            alert('Fill all fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:5001/api/superAdmin/parking-areas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newArea)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNewArea({ name: '', location: '', qrCode: '', amount: '', managerId: '' });
            fetchParkingAreas();
            fetchManagers();
        } catch (err) {
            alert(err.message || 'Failed to create area');
        }
    };

    const approveDriver = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/superAdmin/approve-driver/${userId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert('Driver approved');
            fetchPendingDrivers();
        } catch (err) {
            alert(err.message || 'Approval failed');
        }
    };

    useEffect(() => {
        fetchParkingAreas();
        fetchManagers();
        fetchPendingDrivers();
    }, []);

    const availableManagers = managers.filter(m => m.status === 'PENDING');

    /* ---------------- UI ---------------- */

    const renderAreas = () => (
        <div>
            <h3 style={{ marginBottom: '15px' }}>Parking Areas</h3>

            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                <h5 style={{ marginBottom: '10px' }}>Create New Area</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input className="input" style={{ padding: '8px' }} placeholder="Name" value={newArea.name}
                        onChange={e => setNewArea({ ...newArea, name: e.target.value })} />

                    <input className="input" style={{ padding: '8px' }} placeholder="Location" value={newArea.location}
                        onChange={e => setNewArea({ ...newArea, location: e.target.value })} />

                    <input className="input" style={{ padding: '8px' }} placeholder="QR Code String" value={newArea.qrCode}
                        onChange={e => setNewArea({ ...newArea, qrCode: e.target.value })} />

                    <input className="input" style={{ padding: '8px' }} type="number" placeholder="Hourly Rate" value={newArea.amount}
                        onChange={e => setNewArea({ ...newArea, amount: e.target.value })} />

                    <select className="input" style={{ padding: '8px' }} value={newArea.managerId}
                        onChange={e => setNewArea({ ...newArea, managerId: e.target.value })}>
                        <option value="">Select Manager</option>
                        {availableManagers.map(m => (
                            <option key={m.userId} value={m.userId}>{m.user.name}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={createParkingArea}>Create Area</button>
                </div>
            </div>

            {loadingAreas && <p>Loading areas...</p>}

            <div className="grid">
                {parkingAreas.map(a => (
                    <div key={a.id} className="card">
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{a.name}</div>
                        <div style={{ color: '#666' }}>{a.location}</div>
                        <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
                            Manager: <strong>{a.manager?.user?.name || 'Unassigned'}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderManagers = () => (
        <div>
            <h3 style={{ marginBottom: '15px' }}>Managers</h3>

            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                <h5 style={{ marginBottom: '10px' }}>Add New Manager</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input className="input" style={{ padding: '8px' }} placeholder="Name"
                        value={newManager.name}
                        onChange={e => setNewManager({ ...newManager, name: e.target.value })} />

                    <input className="input" style={{ padding: '8px' }} placeholder="Email"
                        value={newManager.email}
                        onChange={e => setNewManager({ ...newManager, email: e.target.value })} />

                    <input className="input" style={{ padding: '8px' }} type="password" placeholder="Password"
                        value={newManager.password}
                        onChange={e => setNewManager({ ...newManager, password: e.target.value })} />

                    <button className="btn btn-primary" onClick={addManager}>Add Manager</button>
                </div>
            </div>

            {loadingManagers && <p>Loading managers...</p>}

            <div className="grid">
                {managers.map(m => (
                    <div key={m.userId} className="card">
                        <div style={{ fontWeight: 'bold' }}>{m.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{m.user?.email}</div>
                        <div style={{ marginTop: '5px' }}>
                            Status: <span style={{ color: m.status === 'ACTIVE' ? 'var(--success-color)' : 'var(--warning-color)' }}>{m.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDrivers = () => (
        <div>
            <h3 style={{ marginBottom: '15px' }}>Pending Drivers</h3>

            {pendingDrivers.length === 0 && <p>No pending driver requests.</p>}

            <div className="grid">
                {pendingDrivers.map(d => (
                    <div key={d.userId} className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
                        <div style={{ fontWeight: 'bold' }}>{d.user?.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{d.user?.email}</div>
                        <div style={{ marginTop: '5px' }}>DL: {d.dlNumber}</div>
                        <div style={{ marginTop: '5px' }}>Requested Area: {d.parkingArea?.name}</div>
                        <br />
                        <button className="btn btn-primary" onClick={() => approveDriver(d.userId)}>Approve Driver</button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Super Admin Panel</h2>

            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px', overflowX: 'auto' }}>
                {['AREAS', 'MANAGERS', 'DRIVERS'].map(tab => (
                    <div
                        key={tab}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                            color: activeTab === tab ? 'var(--primary-color)' : '#666',
                            whiteSpace: 'nowrap'
                        }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {activeTab === 'AREAS' && renderAreas()}
            {activeTab === 'MANAGERS' && renderManagers()}
            {activeTab === 'DRIVERS' && renderDrivers()}
        </div>
    );
}

export default SuperAdminDashboard;


