import React from 'react';

function Ticket({ ticket, onRequestRetrieval, onNavigate }) {
    if (!ticket) return <div>No Active Ticket</div>;

    const isRetrievalRequested = ticket.status === 'RETRIEVAL_REQUESTED';
    const isDriverAssigned = ticket.status === 'DRIVER_ASSIGNED';
    const isCompleted = ticket.status === 'COMPLETED';

    const getStatusColor = () => {
        if (isCompleted) return '#28a745';
        if (isDriverAssigned) return '#17a2b8';
        if (isRetrievalRequested) return '#ffc107';
        return '#6c757d'; // Default/Requested
    };

    const styles = {
        container: { padding: '20px', textAlign: 'center' },
        ticketCard: {
            backgroundColor: 'white',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            position: 'relative',
            overflow: 'hidden',
        },
        statusBadge: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: getStatusColor(),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
        },
        qrCode: {
            width: '150px',
            height: '150px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            margin: '0 auto 15px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
        },
        details: { textAlign: 'left', lineHeight: '1.6' },
        label: { color: '#666', fontSize: '14px' },
        value: { fontWeight: 'bold', marginBottom: '5px' },
        actionButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
        },
        message: {
            marginTop: '20px',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: isDriverAssigned ? '#cce5ff' : '#d4edda',
            color: isDriverAssigned ? '#004085' : '#155724',
        }
    };

    return (
        <div style={styles.container}>
            <h2>Your Parking Ticket</h2>

            <div style={styles.ticketCard}>
                <div style={styles.statusBadge}>{ticket.status}</div>
                <div style={styles.qrCode}>[QR Code]</div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>{ticket.ticketNumber}</div>

                <div style={styles.details}>
                    <div style={styles.label}>Location ID</div>
                    <div style={styles.value}>{ticket.parkingAreaId}</div>

                    <div style={styles.label}>Entry Time</div>
                    <div style={styles.value}>{new Date(ticket.createdAt).toLocaleString()}</div>
                </div>
            </div>

            {ticket.status === 'CALLED' && (
                <div style={{ ...styles.message, backgroundColor: '#fff3cd', color: '#856404' }}>
                    <strong>Waiting for Driver...</strong><br />
                    Your request has been broadcasted to nearby drivers.
                </div>
            )}

            {isDriverAssigned && (
                <div style={styles.message}>
                    <strong>Valet Driver Assigned!</strong><br />
                    A driver is on their way to handle your car.
                </div>
            )}

            {isCompleted && (
                <div style={styles.message}>
                    <strong>Parked Successfully!</strong><br />
                    Your car has been parked securely.
                </div>
            )}

            {/* Retrieval Button logic would go here if flow was PARKED -> RETRIEVE */}
            {/* For now we just show status flow per specific user request scenario */}
        </div>
    );
}

export default Ticket;
