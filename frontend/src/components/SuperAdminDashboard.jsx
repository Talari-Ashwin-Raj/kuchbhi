import React, { useState } from 'react';

function SuperAdminDashboard({ users, managers, drivers, parkingAreas, onAddManager, onCreateArea, onApproveDriver }) {
    const [activeTab, setActiveTab] = useState('AREAS'); // AREAS, MANAGERS, DRIVERS

    // Forms state
    const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
    const [newArea, setNewArea] = useState({ name: '', location: '', qrCode: '', amount: '', managerId: '' });

    const styles = {
        container: { padding: '10px' },
        tabs: { display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' },
        tab: (isActive) => ({
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: isActive ? '2px solid #007bff' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
        }),
        card: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #eee' },
        input: { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' },
        button: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    // Filters
    const pendingDrivers = drivers.filter(d => d.status === 'INACTIVE');
    const availableManagers = managers.filter(m => m.status === 'PENDING').map(m => {
        const u = users.find(u => u.id === m.userId);
        return { ...m, name: u?.name, email: u?.email };
    });

    // Content Renderers
    const renderAreas = () => (
        <div>
            <h4>Active Parking Areas</h4>
            {parkingAreas.map(area => (
                <div key={area.id} style={styles.card}>
                    <strong>{area.name}</strong> ({area.location})
                    <br /><small>Manager: {users.find(u => u.id === area.managerId)?.name || area.managerId}</small>
                </div>
            ))}

            <div style={{ ...styles.card, backgroundColor: '#f9f9f9' }}>
                <h5>Create New Area</h5>
                <input style={styles.input} placeholder="Area Name" value={newArea.name} onChange={e => setNewArea({ ...newArea, name: e.target.value })} />
                <input style={styles.input} placeholder="Location" value={newArea.location} onChange={e => setNewArea({ ...newArea, location: e.target.value })} />
                <input style={styles.input} placeholder="QR Code String" value={newArea.qrCode} onChange={e => setNewArea({ ...newArea, qrCode: e.target.value })} />
                <input style={styles.input} placeholder="Amount" value={newArea.amount} onChange={e => setNewArea({ ...newArea, amount: e.target.value })} />

                <select style={styles.input} value={newArea.managerId} onChange={e => setNewArea({ ...newArea, managerId: e.target.value })}>
                    <option value="">Select Pending Manager</option>
                    {availableManagers.map(m => (
                        <option key={m.userId} value={m.userId}>{m.name} ({m.email})</option>
                    ))}
                </select>

                <button style={styles.button} onClick={() => { onCreateArea(newArea, newArea.managerId); setNewArea({ name: '', location: '', qrCode: '', amount: '', managerId: '' }); }}>
                    Create Area
                </button>
            </div>
        </div>
    );

    const renderManagers = () => (
        <div>
            <h4>Managers</h4>
            {managers.map(m => {
                const u = users.find(u => u.id === m.userId);
                return (
                    <div key={m.userId} style={styles.card}>
                        <strong>{u?.name}</strong> <small>({m.status})</small>
                    </div>
                );
            })}

            <div style={{ ...styles.card, backgroundColor: '#f9f9f9' }}>
                <h5>Add New Manager</h5>
                <input style={styles.input} placeholder="Name" value={newManager.name} onChange={e => setNewManager({ ...newManager, name: e.target.value })} />
                <input style={styles.input} placeholder="Email" value={newManager.email} onChange={e => setNewManager({ ...newManager, email: e.target.value })} />
                <input style={styles.input} placeholder="Password" value={newManager.password} onChange={e => setNewManager({ ...newManager, password: e.target.value })} />
                <button style={styles.button} onClick={() => { onAddManager(newManager); setNewManager({ name: '', email: '', password: '' }); }}>
                    Add Manager
                </button>
            </div>
        </div>
    );

    const renderDrivers = () => (
        <div>
            <h4>Driver Approvals</h4>
            {pendingDrivers.length === 0 ? <p>No pending approvals.</p> : pendingDrivers.map(d => {
                const u = users.find(u => u.id === d.userId);
                return (
                    <div key={d.userId} style={styles.card}>
                        <strong>{u?.name}</strong> ({u?.email})
                        <br /><small>DL: {d.dlNumber}</small>
                        <br />
                        <button style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }} onClick={() => onApproveDriver(d.userId)}>
                            Approve
                        </button>
                    </div>
                );
            })}
        </div>
    );

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
