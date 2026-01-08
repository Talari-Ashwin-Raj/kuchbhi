import React, { useState } from 'react';

function LoginScreen({ onLogin, onNavigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // clear previous error

        const result = await onLogin(email, password);

        if (!result.success) {
            setError(result.message || 'Login failed');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '20px',
        },
        card: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '350px',
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
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
            fontSize: '14px',
        },
        link: {
            marginTop: '15px',
            fontSize: '14px',
            color: '#007bff',
            cursor: 'pointer',
            textAlign: 'center',
        },
        testcreds: {
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#333'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Parking App Login</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@test.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123"
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <div style={styles.link} onClick={() => onNavigate('REGISTER')}>
                    Don't have an account? Register
                </div>

                <div style={styles['testcreds']}>
                    <strong>Test Credentials:</strong><br />
                    User: user@test.com / 123<br />
                    Manager: manager@test.com / 123<br />
                    Driver: driver@test.com / 123<br />
                    Admin: admin@test.com / 123
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
