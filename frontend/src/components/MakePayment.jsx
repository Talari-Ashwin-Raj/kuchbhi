import React, { useState } from 'react';

function MakePayment({ onNavigate, onPay, amount }) {
    const [isProcessing, setIsProcessing] = useState(false);




    const styles = {
        container: {
            padding: '20px',
            textAlign: 'center',
        },
        amount: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#28a745',
            margin: '20px 0',
        },
        cardForm: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'left',
            maxWidth: '300px',
            margin: '0 auto 20px auto',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            <h2>Payment Due</h2>
            <div style={styles.amount}>₹{amount.toFixed(2)}</div>

            <div style={styles.cardForm}>
                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Credit Card Details</div>
                <input style={styles.input} placeholder="Card Number (Dummy)" defaultValue="4242 4242 4242 4242" disabled />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={styles.input} placeholder="MM/YY" defaultValue="12/25" disabled />
                    <input style={styles.input} placeholder="CVC" defaultValue="123" disabled />
                </div>
            </div>

            <button
                style={{ ...styles.button, backgroundColor: isProcessing ? '#6c757d' : '#28a745' }}
                onClick={async () => {
                    setIsProcessing(true);
                    await onPay();
                    setIsProcessing(false);
                }}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
            </button>
        </div>
    );
}

export default MakePayment;
