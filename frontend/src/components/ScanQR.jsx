import React, { useState } from 'react';

function ScanQR({ onScanSuccess, onCancel }) {
    // Internal state for the scanner UI (e.g. simulating camera loading)
    const [scanning, setScanning] = useState(true);

    const handleSimulateScan = () => {
        // In a real implementation, this would come from a library like react-qr-reader
        // For now, we simulate finding a valid ParkingArea QR code.
        // Schema requires a 'qrCode' string.
        const mockQRCode = "dummyQR1";

        // STRICT RULE: No navigation here. Just verify data availability and callback.
        if (onScanSuccess) {
            onScanSuccess(mockQRCode);
        }
    };

    const styles = {
        container: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            backgroundColor: '#000', // Camera view feel
            color: 'white',
            position: 'relative',
        },
        scannerFrame: {
            width: '250px',
            height: '250px',
            border: '2px solid #00ff00',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
        },
        scanLine: {
            width: '100%',
            height: '2px',
            backgroundColor: '#00ff00',
            position: 'absolute',
            animation: 'scan 2s infinite linear',
        },
        instruction: {
            marginBottom: '30px',
            color: '#ccc',
            fontSize: '14px',
        },
        button: {
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        cancelButton: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            {/* <button style={styles.cancelButton} onClick={onCancel}>✕</button> */}

            <div style={styles.scannerFrame}>
                {scanning && (
                    <>
                        <div className="scan-line" style={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#00ff00',
                            position: 'absolute',
                            top: '50%',
                            boxShadow: '0 0 4px #00ff00'
                        }} />
                        {/* We would use a real <video> element here */}
                        <span style={{ fontSize: '12px', color: '#00ff00' }}>[CAMERA FEED]</span>
                    </>
                )}
            </div>

            <p style={styles.instruction}>Align QR code within the frame</p>

            <button style={styles.button} onClick={handleSimulateScan}>
                Simulate Scan
            </button>
        </div>
    );
}

export default ScanQR;
