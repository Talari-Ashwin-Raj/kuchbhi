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

    return (
        <div className="center-screen">
            <div className="card auth-card slide-up">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Parking App Login</h2>

                {error && (
                    <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@test.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.75rem', fontSize: '1.1rem' }}>
                        Login
                    </button>
                </form>

                <div
                    style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--primary-color)', cursor: 'pointer' }}
                    onClick={() => onNavigate('REGISTER')}
                >
                    Don't have an account? <strong>Register</strong>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
