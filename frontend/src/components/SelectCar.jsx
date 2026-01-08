import React, { useState } from 'react';

function SelectCar({ cars, onAddCar, onNavigate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCar, setNewCar] = useState({ plate: '', model: '' });

    const handleCarSelect = (carId) => {
        onNavigate('BUSINESS_INFO', { carId });
    };

    const handleSaveCar = (e) => {
        e.preventDefault();
        if (newCar.plate && newCar.model) {
            onAddCar(newCar);
            setNewCar({ plate: '', model: '' });
            setShowAddForm(false);
        }
    };

    const styles = {
        container: {
            padding: '10px',
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
        },
        card: {
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'white',
            transition: 'background-color 0.2s',
        },
        addButton: {
            width: '100%',
            padding: '10px',
            border: '1px dashed #007bff',
            color: '#007bff',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
        },
        form: {
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#white',
            border: '1px solid #ddd',
            borderRadius: '8px',
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
        },
        saveButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            <h3>Select Your Vehicle</h3>
            <div style={styles.list}>
                {cars.map(car => (
                    <div
                        key={car.id}
                        style={styles.card}
                        onClick={() => handleCarSelect(car.id)}
                    >
                        <div style={{ fontWeight: 'bold' }}>{car.plate}</div>
                        <div style={{ color: '#666' }}>{car.model}</div>
                    </div>
                ))}
            </div>

            {!showAddForm ? (
                <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
                    + Add New Car
                </button>
            ) : (
                <form style={styles.form} onSubmit={handleSaveCar}>
                    <h4>Add New Car</h4>
                    <input
                        style={styles.input}
                        placeholder="License Plate (e.g., LMN-456)"
                        value={newCar.plate}
                        onChange={e => setNewCar({ ...newCar, plate: e.target.value })}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Model (e.g., Ford Focus)"
                        value={newCar.model}
                        onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={styles.saveButton}>Save Car</button>
                        <button
                            type="button"
                            style={{ ...styles.saveButton, backgroundColor: '#6c757d' }}
                            onClick={() => setShowAddForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default SelectCar;
