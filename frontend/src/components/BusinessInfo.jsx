// import React from 'react';

// function BusinessInfo({ car, parkingArea, onNavigate }) {
//     // Prevents crash if state is temporarily null/undefined
//     // if (!car || !parkingArea) {
//     //     return (
//     //         <div style={{ padding: '20px', textAlign: 'center' }}>
//     //             <h3>Loading booking details...</h3>
//     //             <p>Please wait or try scanning again.</p>
//     //             <button
//     //                 onClick={() => onNavigate('USER_DASHBOARD')}
//     //                 style={{
//     //                     padding: '10px 20px',
//     //                     background: '#ef4444',
//     //                     color: 'white',
//     //                     border: 'none',
//     //                     borderRadius: '8px',
//     //                     cursor: 'pointer'
//     //                 }}
//     //             >
//     //                 Go Home
//     //             </button>
//     //         </div>
//     //     );
//     // }

//     // 2. Business Logic calculations
//     const baseRate = 100;
//     const serviceFee = 30;
//     const gst = 20;
//     const totalAmount = baseRate + serviceFee + gst;

//     const styles = {
//         container: { padding: '16px', fontFamily: 'sans-serif' },
//         card: {
//             background: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//             marginBottom: '16px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             border: '1px solid #e5e7eb'
//         },
//         sectionTitle: {
//             fontSize: '18px',
//             fontWeight: '600',
//             marginBottom: '12px',
//             color: '#111827'
//         },
//         row: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginBottom: '8px',
//             fontSize: '14px',
//             color: '#4b5563'
//         },
//         value: {
//             fontWeight: '500',
//             color: '#111827'
//         },
//         divider: {
//             margin: '12px 0',
//             border: '0',
//             borderTop: '1px solid #e5e7eb'
//         },
//         totalRow: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             fontSize: '18px',
//             fontWeight: 'bold',
//             color: '#111827'
//         },
//         button: {
//             width: '100%',
//             padding: '16px',
//             backgroundColor: '#4f46e5',
//             color: 'white',
//             border: 'none',
//             borderRadius: '12px',
//             fontSize: '16px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             marginTop: '8px'
//         }
//     };

//     return (
//         <div style={styles.container}>
//             {/* Car Details */}
//             <div style={styles.card}>
//                 <div style={styles.sectionTitle}>Vehicle Details</div>
//                 <div style={styles.row}>
//                     <span>Vehicle</span>
//                     <span style={styles.value}>{car.brand} {car.model}</span>
//                 </div>
//                 <div style={styles.row}>
//                     <span>Plate Number</span>
//                     <span style={styles.value}>{car.plateNumber}</span>
//                 </div>
//                 <div style={styles.row}>
//                     <span>Color</span>
//                     <span style={styles.value}>{car.color}</span>
//                 </div>
//             </div>

//             {/* Parking Details */}
//             <div style={styles.card}>
//                 <div style={styles.sectionTitle}>Parking Location</div>
//                 <div style={styles.row}>
//                     <span>Area Name</span>
//                     <span style={styles.value}>{parkingArea.name}</span>
//                 </div>
//                 <div style={styles.row}>
//                     <span>Status</span>
//                     <span style={{ ...styles.value, color: 'green' }}>Reserved</span>
//                 </div>
//             </div>

//             {/* Payment Summary */}
//             <div style={styles.card}>
//                 <div style={styles.sectionTitle}>Payment Summary</div>
//                 <div style={styles.row}>
//                     <span>Base Rate</span>
//                     <span style={styles.value}>₹{baseRate}</span>
//                 </div>
//                 <div style={styles.row}>
//                     <span>Service Fee</span>
//                     <span style={styles.value}>₹{serviceFee}</span>
//                 </div>
//                 <div style={styles.row}>
//                     <span>GST</span>
//                     <span style={styles.value}>₹{gst}</span>
//                 </div>
//                 <hr style={styles.divider} />
//                 <div style={styles.totalRow}>
//                     <span>Total</span>
//                     <span>₹{totalAmount}</span>
//                 </div>
//             </div>

//             {/* Action */}
//             <button
//                 style={styles.button}
//                 onClick={() => onNavigate('MAKE_PAYMENT', { amount: totalAmount })}
//             >
//                 Proceed to Payment
//             </button>
//         </div>
//     );
// }

// export default BusinessInfo;
function BusinessInfo({ car, parkingArea, onNavigate }) {
    if (!car || !parkingArea) {
        return <div style={{ padding: 20 }}>Loading...</div>;
    }


    return (
        <div style={{ padding: 15 }}>
            <h3>Vehicle</h3>
            <p>{car.brand} {car.model}</p>
            <p>Plate: {car.plateNumber}</p>

            <h3>Parking Area</h3>
            <p>{parkingArea.name}</p>

            <h3>Payment</h3>
            <p>Total: ₹{parkingArea.amount}</p>

            <button
                onClick={() => onNavigate('MAKE_PAYMENT', { amount: Number(parkingArea.amount) })}
                style={{
                    width: '100%',
                    padding: 12,
                    marginTop: 20,
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6
                }}
            >
                Proceed to Payment
            </button>
        </div>
    );
}
export default BusinessInfo;