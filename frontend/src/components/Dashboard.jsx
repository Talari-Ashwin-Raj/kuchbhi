import React from 'react';

function Dashboard({ user, bookings, activeTicket, onNavigate }) {
    const styles = {
        container: {
            padding: '10px',
        },
        welcome: {
            fontSize: '20px',
            marginBottom: '20px',
        },
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
        },
        activeTicketBanner: {
            backgroundColor: '#ffc107',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            color: '#333',
        },
        sectionTitle: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px',
        },
        bookingCard: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '10px',
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.welcome}>Welcome, {user ? user.name : 'User'}!</h2>

            {activeTicket && (
                <div style={styles.activeTicketBanner} onClick={() => onNavigate('TICKET_DISPLAY')}>
                    <strong>🎫 View Active Ticket</strong>
                    <div style={{ fontSize: '12px' }}>{activeTicket.location} - {activeTicket.status}</div>
                </div>
            )}

            <button style={styles.actionButton} onClick={() => onNavigate('SCAN_QR')}>
                📸 Scan QR Code
            </button>

            <div>
                <h3 style={styles.sectionTitle}>Previous Bookings</h3>
                {bookings && bookings.map(booking => (
                    <div key={booking.id} style={styles.bookingCard}>
                        <div style={{ fontWeight: 'bold' }}>{booking.location}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{booking.date}</div>
                        <div style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>{booking.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
