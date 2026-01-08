import React from 'react';

function BusinessInfo({ onNavigate }) {
    // Dummy data - in real app would come from API based on businessId
    const business = {
        name: 'City Center Mall Parking',
        address: '123 Market St',
        rate: '$5.00 / hour',
        zones: ['Zone A', 'Zone B', 'VIP']
    };

    const handleConfirm = () => {
        onNavigate('MAKE_PAYMENT');
    };

    const styles = {
        container: {
            padding: '20px',
            textAlign: 'center',
        },
        image: {
            width: '100%',
            height: '150px',
            backgroundColor: '#ddd',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        details: {
            textAlign: 'left',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px',
        },
        button: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.image}>
                [Business Image]
            </div>
            <div style={styles.details}>
                <h2 style={{ marginTop: 0 }}>{business.name}</h2>
                <p style={{ color: '#666' }}>📍 {business.address}</p>
                <div style={{ margin: '15px 0', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <strong>Rate:</strong> {business.rate}
                </div>
                <div>
                    <strong>Available Zones:</strong>
                    <ul style={{ paddingLeft: '20px' }}>
                        {business.zones.map(z => <li key={z}>{z}</li>)}
                    </ul>
                </div>
            </div>

            <button style={styles.button} onClick={handleConfirm}>
                Proceed to Payment
            </button>
        </div>
    );
}

export default BusinessInfo;
