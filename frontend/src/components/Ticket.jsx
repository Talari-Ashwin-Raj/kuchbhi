import React from 'react';

function Ticket({ ticket, onRequestRetrieval, onNavigate }) {
    if (!ticket) return <div className="container" style={{ padding: 20 }}>No Active Ticket</div>;

    const isRetrievalRequested = ticket.status === 'RETRIEVAL_REQUESTED';
    const isDriverAssigned = ticket.status === 'DRIVER_ASSIGNED';
    const isCompleted = ticket.status === 'COMPLETED';

    const getStatusColor = () => {
        if (isCompleted) return 'var(--success-color)';
        if (isDriverAssigned) return '#17a2b8';
        if (isRetrievalRequested) return 'var(--warning-color)';
        return '#6c757d'; // Default/Requested
    };

    return (
        <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>Your Parking Ticket</h2>

            <div className="card" style={{
                border: '2px solid #333',
                position: 'relative',
                overflow: 'hidden',
                padding: '20px',
                textAlign: 'left'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: getStatusColor(),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
                    {ticket.status}
                </div>

                <div style={{
                    width: '100%',
                    height: '150px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #ddd',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#aaa',
                    fontSize: '1.2rem'
                }}>
                    QR CODE<br />(Placeholder)
                </div>

                <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px', textAlign: 'center' }}>{ticket.ticketNumber}</div>

                <div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Location ID</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{ticket.parkingAreaId}</div>

                    <div style={{ color: '#666', fontSize: '14px' }}>Vehicle</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        {ticket.cars?.plateNumber || ticket.cars?.model || 'N/A'}
                    </div>



                    <div style={{ color: '#666', fontSize: '14px' }}>Entry Time</div>
                    <div style={{ fontWeight: 'bold' }}>{new Date(ticket.createdAt).toLocaleString()}</div>
                </div>
            </div>

            {ticket.status === 'CALLED' && (
                <div className="card" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                    <strong>Waiting for Driver...</strong><br />
                    Your request has been broadcasted to nearby drivers.
                </div>
            )}

            {isDriverAssigned && (
                <div className="card" style={{ backgroundColor: '#cce5ff', color: '#004085' }}>
                    <strong>Valet Driver Assigned!</strong><br />
                    A driver is on their way to handle your car.
                </div>
            )}

            {isCompleted && (
                <div className="card" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                    <strong>Parked Successfully!</strong><br />
                    Your car has been parked securely.
                </div>
            )}
        </div>
    );
}

export default Ticket;
