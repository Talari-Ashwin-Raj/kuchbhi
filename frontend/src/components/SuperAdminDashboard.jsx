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

    const styles = {
        container: { padding: 10 },
        tabs: { display: 'flex', borderBottom: '1px solid #ddd', marginBottom: 20 },
        tab: active => ({
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: active ? '2px solid #007bff' : 'none',
            fontWeight: active ? 'bold' : 'normal'
        }),
        card: { background: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, border: '1px solid #eee' },
        input: { width: '100%', padding: 8, marginBottom: 10 },
        button: { padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }
    };

    const renderAreas = () => (
        <div>
            <h4>Parking Areas</h4>

            {loadingAreas && <p>Loading...</p>}

            {parkingAreas.map(a => (
                <div key={a.id} style={styles.card}>
                    <b>{a.name}</b> ({a.location})<br />
                    Manager: {a.manager?.user?.name || 'Unassigned'}
                </div>
            ))}

            <div style={styles.card}>
                <h5>Create Area</h5>

                <input style={styles.input} placeholder="Name" value={newArea.name}
                    onChange={e => setNewArea({ ...newArea, name: e.target.value })} />

                <input style={styles.input} placeholder="Location" value={newArea.location}
                    onChange={e => setNewArea({ ...newArea, location: e.target.value })} />

                <input style={styles.input} placeholder="QR Code" value={newArea.qrCode}
                    onChange={e => setNewArea({ ...newArea, qrCode: e.target.value })} />

                <input style={styles.input} placeholder="Amount" value={newArea.amount}
                    onChange={e => setNewArea({ ...newArea, amount: e.target.value })} />

                <select style={styles.input} value={newArea.managerId}
                    onChange={e => setNewArea({ ...newArea, managerId: e.target.value })}>
                    <option value="">Select Manager</option>
                    {availableManagers.map(m => (
                        <option key={m.userId} value={m.userId}>{m.user.name}</option>
                    ))}
                </select>

                <button style={styles.button} onClick={createParkingArea}>Create Area</button>
            </div>
        </div>
    );

    const renderManagers = () => (
        <div>
            <h4>Managers</h4>

            {loadingManagers && <p>Loading...</p>}

            {managers.map(m => (
                <div key={m.userId} style={styles.card}>
                    {m.user.name} – {m.status}
                </div>
            ))}

            <div style={styles.card}>
                <h5>Add Manager</h5>

                <input style={styles.input} placeholder="Name"
                    value={newManager.name}
                    onChange={e => setNewManager({ ...newManager, name: e.target.value })} />

                <input style={styles.input} placeholder="Email"
                    value={newManager.email}
                    onChange={e => setNewManager({ ...newManager, email: e.target.value })} />

                <input style={styles.input} type="password" placeholder="Password"
                    value={newManager.password}
                    onChange={e => setNewManager({ ...newManager, password: e.target.value })} />

                <button style={styles.button} onClick={addManager}>Add Manager</button>
            </div>
        </div>
    );

    const renderDrivers = () => (
        <div>
            <h4>Pending Drivers</h4>

            {pendingDrivers.length === 0 && <p>No pending requests.</p>}

            {pendingDrivers.map(d => (
                <div key={d.userId} style={styles.card}>
                    <b>{d.user.name}</b> ({d.user.email})<br />
                    DL: {d.dlNumber}<br />
                    Area: {d.parkingArea.name}<br /><br />
                    <button onClick={() => approveDriver(d.userId)}>Approve</button>
                </div>
            ))}
        </div>
    );

    return (
        <div style={styles.container}>
            <h3>Super Admin Panel</h3>

            <div style={styles.tabs}>
                <div style={styles.tab(activeTab === 'AREAS')} onClick={() => setActiveTab('AREAS')}>Areas</div>
                <div style={styles.tab(activeTab === 'MANAGERS')} onClick={() => setActiveTab('MANAGERS')}>Managers</div>
                <div style={styles.tab(activeTab === 'DRIVERS')} onClick={() => setActiveTab('DRIVERS')}>Drivers</div>
            </div>

            {activeTab === 'AREAS' && renderAreas()}
            {activeTab === 'MANAGERS' && renderManagers()}
            {activeTab === 'DRIVERS' && renderDrivers()}
        </div>
    );
}

export default SuperAdminDashboard;


