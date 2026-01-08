import React, { useState } from 'react';

function Register({ onNavigate }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            setSuccess('Registration successful. Please login.');
            setTimeout(() => {
                onNavigate('LOGIN');
            }, 1500);
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
        },
        card: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
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
            marginTop: '10px',
            padding: '10px',
            width: '100%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        backButton: {
            marginTop: '15px',
            padding: '10px',
            width: '100%',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
            fontSize: '14px',
        },
        success: {
            color: 'green',
            marginBottom: '10px',
            fontSize: '14px',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Register (User Only)</h2>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleRegister}>
                    <input
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>

                <button
                    style={styles.backButton}
                    onClick={() => onNavigate('LOGIN')}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default Register;
