import React, { useEffect, useState } from 'react';

function Dashboard({ user, activeTicket, onNavigate }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
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
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: { padding: '10px' },
        welcome: { fontSize: '20px', marginBottom: '20px' },
        actionButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            marginBottom: '20px',
            cursor: 'pointer',
        },
        activeTicketBanner: {
            backgroundColor: '#ffc107',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
        },
        sectionTitle: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        bookingCard: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        muted: {
            fontSize: '14px',
            color: '#666'
        }
    };
    return (
        <div style={styles.container}>
            <h2 style={styles.welcome}>
                Welcome, {user?.name || 'User'}!
            </h2>

            {/* ACTIVE TICKET */}
            {activeTicket && (
                <div
                    style={styles.activeTicketBanner}
                    onClick={() => onNavigate('TICKET_DISPLAY')}
                >
                    <strong>🎫 Active Ticket</strong>
                    <div style={styles.muted}>
                        Status: {activeTicket.status}
                    </div>
                </div>
            )}

            {/* SCAN QR */}
            <button
                style={styles.actionButton}
                onClick={() => onNavigate('SCAN_QR')}
            >
                📸 Scan QR Code
            </button>

            {/* PREVIOUS BOOKINGS */}
            <h3 style={styles.sectionTitle}>Previous Bookings</h3>

            {loading && <p>Loading bookings...</p>}

            {!loading && tickets.length === 0 && (
                <p style={styles.muted}>No previous bookings</p>
            )}

            {!loading && tickets.map(ticket => (
                <div key={ticket.id} style={styles.bookingCard}>
                    <div><strong>{ticket.parkingArea?.name || 'Parking Area'}</strong></div>
                    <div style={styles.muted}>
                        {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        Status: {ticket.status}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
