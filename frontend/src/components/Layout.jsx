import React from 'react';

function Layout({ children, onBack, onDashboard, onLogout, showBack, title }) {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxWidth: '500px', // Mobile simulation like requested prompt implies mobile flow
            margin: '0 auto',
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5',
        },
        header: {
            backgroundColor: '#282c34',
            color: 'white',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
            textTransform: 'capitalize',
        },
        button: {
            background: 'none',
            border: '1px solid white',
            color: 'white',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            borderRadius: '4px',
        },
        content: {
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {showBack && (
                        <button style={styles.button} onClick={onBack}>
                            &larr; Back
                        </button>
                    )}
                    <button style={styles.button} onClick={onDashboard}>
                        Home
                    </button>
                </div>
                <div style={styles.title}>{title || 'Parking App'}</div>
                <button style={{ ...styles.button, borderColor: '#ff4444', color: '#ff4444' }} onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main style={styles.content}>
                {children}
            </main>
        </div>
    );
}

export default Layout;
