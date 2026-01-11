import React, { useEffect, useState } from 'react';

function Dashboard({ user, activeTicket, onNavigate }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 3000); // Poll every 3 seconds for status updates
        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('http://localhost:5001/api/user/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) {
                setTickets([]);
                setLoading(false);
                return;
            }
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets', err);
            // Don't clear tickets on error to prevent flickering, just log
        } finally {
            setLoading(false);
        }
    };

    // Derived State
    // Fix: Only look at the latest ticket for "Active" status to prevent old ghost tickets from appearing
    const latestTicket = tickets[0];
    const currentActive = latestTicket && latestTicket.status !== 'COMPLETED' ? latestTicket : null;
    const pastTickets = tickets.filter(t => t.status === 'COMPLETED');

    const requestRetrieval = async (ticketNo) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`http://localhost:5001/api/user/request-retrieval/${ticketNo}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to request retrieval');
            alert('Retrieval Requested! A driver will be assigned shortly.');
            fetchTickets();
            // Ideally update activeTicket state too if it was passed down, 
            // but for now fetchTickets refreshes the list. 
            // The parent App.jsx might need a refresh logic or we rely on the list view.
        } catch (err) { alert(err.message); }
    };

    const styles = {
        // Keeping container for structural padding if needed, but classes preferred
    };

    // Guard against missing user
    if (!user) return <div className="container" style={{ padding: 20 }}>Loading user profile...</div>;

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>
                Welcome, {user.name || 'User'}!
            </h2>

            {/* ACTIVE TICKET */}
            {currentActive && (
                <div
                    className="card"
                    style={{
                        backgroundColor: '#fff3cd',
                        borderColor: '#ffeeba',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                    onClick={() => onNavigate('TICKET_DISPLAY', { ticket: currentActive })}
                >
                    <div>
                        <strong style={{ fontSize: '1.1rem' }}>🎫 Active Ticket</strong>
                        <div style={{ color: '#856404', marginTop: '5px' }}>
                            Status: <span style={{ fontWeight: 'bold' }}>{currentActive.status}</span>
                        </div>
                    </div>

                    {currentActive.status === 'PARKED' && (
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '10px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                requestRetrieval(currentActive.ticketNumber);
                            }}
                        >
                            Request Retrieval
                        </button>
                    )}
                </div>
            )}

            {/* ERROR / INFO MESSAGE if no active and no history */}
            {!currentActive && pastTickets.length === 0 && !loading && (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>You have no active tickets and no history.</p>
                </div>
            )}

            {/* SCAN QR */}
            <button
                className="btn btn-primary btn-block"
                style={{ padding: '20px', fontSize: '1.2rem', marginBottom: '30px' }}
                onClick={() => onNavigate('SCAN_QR')}
            >
                📸 Scan QR Code
            </button>

            {/* PREVIOUS BOOKINGS */}
            <h3 style={{ marginBottom: '15px' }}>Previous Bookings</h3>

            {loading && <p>Loading bookings...</p>}

            {!loading && pastTickets.length === 0 && (
                <p style={{ color: '#666' }}>No previous bookings found.</p>
            )}

            <div className="grid">
                {!loading && pastTickets.map((ticket, index) => (
                    <div
                        key={ticket.id || ticket.ticketNumber || index}
                        className="card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onNavigate('TICKET_DISPLAY', { ticket })}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{ticket.parkingArea?.name || 'Parking Area'}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>
                            {new Date(ticket.createdAt).toLocaleString()}
                        </div>
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#e2e3e5',
                            fontSize: '0.85rem',
                            marginTop: '5px'
                        }}>
                            Status: {ticket.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
