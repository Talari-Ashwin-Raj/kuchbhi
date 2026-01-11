import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from "html5-qrcode";

function ScanQR({ onScanSuccess, onCancel }) {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                }).catch(err => {
                    // Ignore "not running" errors during cleanup
                    console.warn("Scanner cleanup warn:", err);
                });
            }
        };
    }, []);

    const handleSimulateScan = () => {
        const mockQRCode = "dummyQR1";
        if (onScanSuccess) {
            onScanSuccess(mockQRCode);
        }
    };

    const startCameraScan = () => {
        setIsCameraActive(true);
        setError(null);
        console.log("Initializing camera scanner...");

        // Slight delay to ensure DOM element exists
        setTimeout(() => {
            if (!document.getElementById("reader")) {
                console.error("Reader element not found!");
                setError("Scanner UI error. Please try again.");
                setIsCameraActive(false);
                return;
            }

            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    // Success callback
                    console.log("✅ QR Code Detected:", decodedText);

                    // Stop first to release camera, then navigate
                    stopCameraScan().then(() => {
                        console.log("Scanner stopped. Triggering success navigation with:", decodedText);
                        if (onScanSuccess) onScanSuccess(decodedText);
                    }).catch(err => {
                        console.warn("Scanner stop failed, forcing navigation:", err);
                        if (onScanSuccess) onScanSuccess(decodedText);
                    });
                },
                (errorMessage) => {
                    // Error callback (called frequently if no QR found, ignore mostly)
                    // console.log("Scanning frame...", errorMessage); 
                }
            ).catch(err => {
                console.error("❌ Failed to start scanner:", err);
                setError("Camera permission denied (Click 'Simulate' if on desktop). Error: " + err);
                setIsCameraActive(false);
            });
        }, 300); // Increased delay slightly to be safe
    };

    const stopCameraScan = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Stop scanner error:", err);
            }
            scannerRef.current = null;
        }
        setIsCameraActive(false);
    };

    return (
        <div className="container" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#000', // Camera feel
            color: 'white'
        }}>
            <h2 style={{ marginBottom: '20px' }}>Scan QR Code</h2>

            {error && (
                <div className="card" style={{ backgroundColor: '#f8d7da', color: '#721c24', marginBottom: 20 }}>
                    {error}
                </div>
            )}

            {/* Camera Container */}
            <div id="reader" style={{
                width: '100%',
                maxWidth: '300px',
                height: '300px',
                backgroundColor: isCameraActive ? '#000' : '#222',
                marginBottom: '20px',
                display: isCameraActive ? 'block' : 'none',
                borderRadius: '8px',
                overflow: 'hidden'
            }}></div>

            {/* Placeholder Container when Camera OFF */}
            {!isCameraActive && (
                <div style={{
                    width: '300px',
                    height: '300px',
                    border: '2px dashed #444',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: '#666'
                }}>
                    <p>Camera Off</p>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
                {!isCameraActive ? (
                    <button
                        className="btn"
                        style={{ backgroundColor: '#28a745', color: 'white', padding: '15px' }}
                        onClick={startCameraScan}
                    >
                        📸 Scan using Camera
                    </button>
                ) : (
                    <button
                        className="btn"
                        style={{ backgroundColor: '#dc3545', color: 'white', padding: '15px' }}
                        onClick={stopCameraScan}
                    >
                        Stop Camera
                    </button>
                )}

                <button
                    className="btn"
                    style={{ backgroundColor: 'transparent', border: '1px solid #666', color: '#ccc', padding: '15px' }}
                    onClick={handleSimulateScan}
                >
                    Simulate Scan (Test)
                </button>
            </div>
        </div>
    );
}

export default ScanQR;
