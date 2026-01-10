// import React, { useEffect, useState } from 'react';

// function SelectCar({ cars = [], onNavigate }) {
//     const [loading, setLoading] = useState(true);
//     const [showAddForm, setShowAddForm] = useState(false);

//     const [newCar, setNewCar] = useState({
//         plateNumber: '',
//         brand: '',
//         model: '',
//         color: ''
//     });

//     useEffect(() => {
//         fetchCars();
//     }, []);

//     const fetchCars = async () => {
//         try {
//             const token = localStorage.getItem('authToken');

//             const res = await fetch('http://localhost:5001/api/user/cars', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             if (!res.ok) {
//                 setCars([]);
//                 return;
//             }
//             const data = await res.json();
//             setCars(data);
//         } catch (err) {
//             console.error('Failed to fetch cars', err);
//             setCars([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleSaveCar = async (e) => {
//         e.preventDefault();

//         try {
//             const token = localStorage.getItem('authToken');

//             const res = await fetch('http://localhost:5001/api/user/cars', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify(newCar)
//             });

//             if (!res.ok) return;

//             setNewCar({ plateNumber: '', brand: '', model: '', color: '' });
//             setShowAddForm(false);
//             fetchCars(); // refresh list
//         } catch (err) {
//             console.error('Failed to add car', err);
//         }
//     };

//     const handleCarSelect = (carId) => {
//         onNavigate('BUSINESS_INFO', { carId });
//     };

//     const styles = {
//         container: { padding: '10px' },
//         card: {
//             padding: '15px',
//             border: '1px solid #ddd',
//             borderRadius: '8px',
//             marginBottom: '10px',
//             cursor: 'pointer',
//             backgroundColor: 'white'
//         },
//         addButton: {
//             width: '100%',
//             padding: '10px',
//             border: '1px dashed #007bff',
//             color: '#007bff',
//             background: 'transparent',
//             borderRadius: '8px',
//             cursor: 'pointer'
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             marginBottom: '10px',
//             borderRadius: '4px',
//             border: '1px solid #ddd'
//         },
//         saveButton: {
//             width: '100%',
//             padding: '10px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h3>Select Your Vehicle</h3>

//             {loading && <p>Loading vehicles...</p>}

//             {!loading && cars.map(car => (
//                 <div
//                     key={car.id}
//                     style={styles.card}
//                     onClick={() => handleCarSelect(car.id)}
//                 >
//                     <strong>{car.plateNumber}</strong>
//                     <div>{car.brand} {car.model}</div>
//                     <div style={{ fontSize: '12px', color: '#666' }}>{car.color}</div>
//                 </div>
//             ))}

//             {!showAddForm ? (
//                 <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
//                     + Add New Car
//                 </button>
//             ) : (
//                 <form onSubmit={handleSaveCar}>
//                     <h4>Add New Car</h4>

//                     <input
//                         style={styles.input}
//                         placeholder="Plate Number"
//                         value={newCar.plateNumber}
//                         onChange={e => setNewCar({ ...newCar, plateNumber: e.target.value })}
//                         required
//                     />

//                     <input
//                         style={styles.input}
//                         placeholder="Brand"
//                         value={newCar.brand}
//                         onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
//                         required
//                     />

//                     <input
//                         style={styles.input}
//                         placeholder="Model"
//                         value={newCar.model}
//                         onChange={e => setNewCar({ ...newCar, model: e.target.value })}
//                         required
//                     />

//                     <input
//                         style={styles.input}
//                         placeholder="Color"
//                         value={newCar.color}
//                         onChange={e => setNewCar({ ...newCar, color: e.target.value })}
//                         required
//                     />

//                     <button type="submit" style={styles.saveButton}>
//                         Save Car
//                     </button>

//                     <button
//                         type="button"
//                         style={{ ...styles.saveButton, backgroundColor: '#6c757d', marginTop: '8px' }}
//                         onClick={() => setShowAddForm(false)}
//                     >
//                         Cancel
//                     </button>
//                 </form>
//             )}
//         </div>
//     );
// }
// export default SelectCar;
import React, { useState } from 'react';

function SelectCar({ cars = [], onAddCar, onNavigate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCar, setNewCar] = useState({
        plateNumber: '',
        brand: '',
        model: '',
        color: ''
    });

    const handleCarSelect = (carId) => {
        onNavigate('BUSINESS_INFO', { carId });
    };

    const handleSaveCar = async (e) => {
        e.preventDefault();

        if (!newCar.plateNumber || !newCar.model || !newCar.brand || !newCar.color) return;

        await onAddCar(newCar);

        setNewCar({ plateNumber: '', brand: '', model: '', color: '' });
        setShowAddForm(false);
    };

    const handleCancel = () => {
        setNewCar({ plateNumber: '', brand: '', model: '', color: '' });
        setShowAddForm(false);
    };

    const styles = {
        container: { padding: '10px' },
        card: {
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            cursor: 'pointer',
            background: '#fff'
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '10px'
        },
        button: {
            padding: '10px',
            width: '100%',
            marginTop: '8px'
        }
    };

    return (
        <div style={styles.container}>
            <h3>Select Your Car</h3>

            {cars.map(car => (
                <div
                    key={car.id}
                    style={styles.card}
                    onClick={() => handleCarSelect(car.id)}
                >
                    <strong>{car.plateNumber}</strong>
                    <div>{car.brand} {car.model}</div>
                </div>
            ))}

            {!showAddForm && (
                <button style={styles.button} onClick={() => setShowAddForm(true)}>
                    + Add New Car
                </button>
            )}

            {showAddForm && (
                <form onSubmit={handleSaveCar}>
                    <input
                        style={styles.input}
                        placeholder="Plate Number"
                        value={newCar.plateNumber}
                        onChange={e => setNewCar({ ...newCar, plateNumber: e.target.value })}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Brand"
                        value={newCar.brand}
                        onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Model"
                        value={newCar.model}
                        onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Color"
                        value={newCar.color}
                        onChange={e => setNewCar({ ...newCar, color: e.target.value })}
                        required
                    />

                    <button type="submit" style={styles.button}>Save</button>
                    <button type="button" style={styles.button} onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default SelectCar;

