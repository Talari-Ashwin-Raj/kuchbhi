import React, { useEffect, useState } from 'react';

function SuperAdminDashboard({ drivers = [], onApproveDriver }) {
    const [activeTab, setActiveTab] = useState('AREAS'); // AREAS, MANAGERS, DRIVERS
    const [parkingAreas, setParkingAreas] = useState([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    // Forms state
    const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
    const [newArea, setNewArea] = useState({ name: '', location: '', qrCode: '', amount: '', managerId: '' });

    // Manager data from backend
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(true);

    /* ---------------- API FUNCTIONS ---------------- */
    const fetchParkingAreas = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch('http://localhost:5001/api/superAdmin/parking-areas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) return;
            const data = await res.json();
            setParkingAreas(data);
        } catch (err) {
            console.error('Failed to fetch parking areas', err);
        } finally {
            setLoadingAreas(false);
        }
    };
    const fetchManagers = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch('http://localhost:5001/api/superAdmin/managers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setManagers(data);
        } catch (err) {
            console.error('Failed to fetch managers', err);
        } finally {
            setLoadingManagers(false);
        }
    };

    const addManager = async () => {
        if (!newManager.name || !newManager.email || !newManager.password) {
            alert('Please fill all fields');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch('http://localhost:5001/api/superAdmin/managers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newManager)
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to add manager');
                return;
            }
            setNewManager({ name: '', email: '', password: '' });
            fetchManagers();
        } catch (err) {
            console.error('Create manager failed', err);
            alert('Server error');
        }
    };
    const createParkingArea = async () => {
        console.log("Create Area clicked");
        if (!newArea.name || !newArea.location || !newArea.qrCode || !newArea.amount || !newArea.managerId) {
            alert('Fill all fields');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            console.log("Token:", token);
            const res = await fetch('http://localhost:5001/api/superAdmin/parking-areas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newArea)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to create area');
                return;
            }

            setNewArea({ name: '', location: '', qrCode: '', amount: '', managerId: '' });
            fetchParkingAreas();
            fetchManagers(); // refresh managers (status changed)

        } catch (err) {
            console.error('Create area failed', err);
        }
    };
    useEffect(() => {
        fetchManagers();
        fetchParkingAreas();
    }, []);
    /* ---------------- DERIVED DATA ---------------- */
    const pendingDrivers = drivers.filter(d => d.status === 'INACTIVE');
    const availableManagers = managers.filter(m => m.status === 'PENDING');
    /* ---------------- STYLES ---------------- */
    const styles = {
        container: { padding: '10px' },
        tabs: { display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' },
        tab: isActive => ({
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: isActive ? '2px solid #007bff' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
        }),
        card: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #eee' },
        input: { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' },
        button: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };
    /* ---------------- UI SECTIONS ---------------- */
    const renderAreas = () => (
        <div>
            <h4>Active Parking Areas</h4>

            {loadingAreas && <p>Loading...</p>}

            {!loadingAreas && parkingAreas.map(area => (
                <div key={area.id} style={styles.card}>
                    <strong>{area.name}</strong> ({area.location})
                    <br />
                    <small>
                        Manager: {area.manager?.user?.name || 'Unassigned'}
                    </small>
                </div>
            ))}

            <div style={{ ...styles.card, backgroundColor: '#f9f9f9' }}>
                <h5>Create New Area</h5>

                <input style={styles.input} placeholder="Area Name"
                    value={newArea.name}
                    onChange={e => setNewArea({ ...newArea, name: e.target.value })}
                />

                <input style={styles.input} placeholder="Location"
                    value={newArea.location}
                    onChange={e => setNewArea({ ...newArea, location: e.target.value })}
                />

                <input style={styles.input} placeholder="QR Code"
                    value={newArea.qrCode}
                    onChange={e => setNewArea({ ...newArea, qrCode: e.target.value })}
                />

                <input style={styles.input} placeholder="Amount"
                    value={newArea.amount}
                    onChange={e => setNewArea({ ...newArea, amount: e.target.value })}
                />

                <select
                    style={styles.input}
                    value={newArea.managerId}
                    onChange={e => setNewArea({ ...newArea, managerId: e.target.value })}
                >
                    <option value="">Select Pending Manager</option>
                    {availableManagers.map(m => (
                        <option key={m.userId} value={m.userId}>
                            {m.user.name}
                        </option>
                    ))}
                </select>

                <button style={styles.button} onClick={createParkingArea}>
                    Create Area
                </button>
            </div>
        </div>
    );

    const renderManagers = () => (
        <div>
            <h4>Managers</h4>

            {loadingManagers && <p>Loading managers...</p>}
            {!loadingManagers && managers.map(m => (
                <div key={m.userId} style={styles.card}>
                    <strong>{m.user.name}</strong> <small>({m.status})</small>
                </div>
            ))}

            <div style={{ ...styles.card, backgroundColor: '#f9f9f9' }}>
                <h5>Add New Manager</h5>

                <input style={styles.input} placeholder="Name"
                    value={newManager.name}
                    onChange={e => setNewManager({ ...newManager, name: e.target.value })}
                />

                <input style={styles.input} placeholder="Email"
                    value={newManager.email}
                    onChange={e => setNewManager({ ...newManager, email: e.target.value })}
                />

                <input style={styles.input} placeholder="Password"
                    type="password"
                    value={newManager.password}
                    onChange={e => setNewManager({ ...newManager, password: e.target.value })}
                />

                <button style={styles.button} onClick={addManager}>
                    Add Manager
                </button>
            </div>
        </div>
    );

    const renderDrivers = () => (
        <div>
            <h4>Driver Approvals</h4>

            {pendingDrivers.length === 0 ? (
                <p>No pending approvals.</p>
            ) : pendingDrivers.map(d => (
                <div key={d.userId} style={styles.card}>
                    <strong>{d.user?.name}</strong> ({d.user?.email})
                    <br />
                    <small>DL: {d.dlNumber}</small>
                    <br />
                    <button
                        style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
                        onClick={() => onApproveDriver(d.userId)}
                    >
                        Approve
                    </button>
                </div>
            ))}
        </div>
    );
    /* ---------------- MAIN RENDER ---------------- */
    return (
        <div style={styles.container}>
            <h3>Super Admin Panel</h3>

            <div style={styles.tabs}>
                <div style={styles.tab(activeTab === 'AREAS')} onClick={() => setActiveTab('AREAS')}>Parking Areas</div>
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

