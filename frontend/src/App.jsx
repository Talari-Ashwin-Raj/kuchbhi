import { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // User Dashboard
import ScanQR from './components/ScanQR';
import SelectCar from './components/SelectCar';
import BusinessInfo from './components/BusinessInfo';
import MakePayment from './components/MakePayment';
import Ticket from './components/Ticket';
import Layout from './components/Layout';
// Role Dashboards
import ManagerDashboard from './components/ManagerDashboard';
import DriverDashboard from './components/DriverDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

/* ---------------- MOCK DATA ---------------- */

const INITIAL_USERS = [];
const INITIAL_AREAS = [];
const INITIAL_CARS = [];
const INITIAL_TICKETS = [];

function App() {
  // --- CENTRALIZED STATE (Simulating Backend) ---
  const [scannedArea, setScannedArea] = useState(null);
  const [cars, setCars] = useState(INITIAL_CARS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  // --- APP STATE ---
  const [currentUser, setCurrentUser] = useState(null); // The logged-in User object
  const [currentScreen, setCurrentScreen] = useState('LOGIN');
  const [history, setHistory] = useState([]);
  // consol
  // --- USER FLOW STATE ---
  // When a user scans a QR, we store the resolved area here
  const [bookingFlow, setBookingFlow] = useState({
    carId: null,
    parkingAreaId: null,
    amount: null
  })
  const [activeTicket, setActiveTicket] = useState(null); // Simplified User View

  /* ----------- RESTORE SESSION (IMPORTANT) ----------- */
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');
      const savedScreen = localStorage.getItem('currentScreen');
      if (token && savedUser && savedScreen) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser) {
          setCurrentUser(parsedUser);
          setHistory([savedScreen]);
          setCurrentScreen(savedScreen);
        }
      }
    } catch (e) {
      console.error("Failed to restore session:", e);
      localStorage.clear(); // Clear corrupted session
    }
  }, []);
  console.log(currentUser);
  // FIX: Restore fetchCars to prevent crash
  const fetchCars = async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const res = await fetch('http://localhost:5001/api/user/cars', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleAddCar = async (carData) => {
    try {
      const token = localStorage.getItem('authToken');

      const res = await fetch('http://localhost:5001/api/user/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData)
      });

      if (!res.ok) throw new Error('Failed to add car');

      const newCar = await res.json();

      // update global state
      setCars(prev => [...prev, newCar]);

    } catch (err) {
      console.error(err);
      alert('Failed to add car');
    }
  };

  // SYNC CARS ON SCREEN CHANGE (To ensure latest cars are available for BusinessInfo)
  useEffect(() => {
    if (currentUser) {
      fetchCars();
    }
  }, [currentUser]); // Verify cars whenever screen changes (e.g. after adding car)

  const navigateTo = (screen, data = {}) => {
    if (Object.keys(data).length > 0) {
      setBookingFlow(prev => ({ ...prev, ...data }));
      if (data.ticket) {
        setActiveTicket(data.ticket);
      }
    }
    if (data.ticket) {
      setActiveTicket(data.ticket);
    }
    if (screen == 'LOGIN' || screen == 'REGISTER') {
      setCurrentScreen(screen);
    }
    else {
      setHistory(prev => [...prev, screen]);
      setCurrentScreen(screen);
      // localStorage.setItem('currentScreen', screen);
    }
    // Handle data passing if needed (usually via state updates before nav)
  };

  const goBack = () => {
    const newHistory = [...history];
    newHistory.pop();
    const prev = newHistory[newHistory.length - 1] || 'LOGIN';
    setHistory(newHistory);
    // If popping back to login, ensure logout? No, usually back doesn't logout.
    // If history empty, go login.
    if (newHistory.length === 0) {
      setCurrentScreen('LOGIN');
    } else {
      setCurrentScreen(prev);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setHistory([]);
    setCurrentScreen('LOGIN');
  };

  // --- AUTHENTICATION ---
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (e) {
          errData = { error: 'Server error' };
        }
        console.log(errData);
        return { success: false, message: errData.error || 'Login failed' };
      }

      const data = await response.json();
      /**
       * Expected response:
       * {
       *   token: "jwt-token",
       *   user: {
       *     id,
       *     name,
       *     email,
       *     role
       *   }
       * }
       */

      // Store token (client-side)

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      setCurrentUser(data.user);

      const dashboard = `${data.user.role}_DASHBOARD`;
      localStorage.setItem('currentScreen', dashboard);
      navigateTo(dashboard);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error' };
    }
  };

  // --- BUSINESS LOGIC: USER ---


  const handleScanSuccess = async (qrCode) => {
    try {
      const token = localStorage.getItem('authToken');

      const res = await fetch(
        `http://localhost:5001/api/user/parking-area-by-qr/${qrCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Invalid QR Code');
        return;
      }
      setScannedArea(data);
      navigateTo('SELECT_CAR', { parkingAreaId: data.id });

    } catch (err) {
      console.error(err);
      alert('Server error while scanning QR: ' + (err.message || 'Unknown error'));
    }
  };

  // const handleAddCar = (carData) => new Promise((resolve) => {
  //   const newCar = { ...carData, id: `c-${Date.now()}`, userId: currentUser.id };
  //   setCars([...cars, newCar]);
  //   resolve();
  // });

  const handlePaymentSuccess = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5001/api/user/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: bookingFlow.carId,
          parkingAreaId: bookingFlow.parkingAreaId
        })
      });

      if (!res.ok) throw new Error('Payment/Ticket creation failed');
      const newTicket = await res.json();

      setTickets([newTicket, ...tickets]);
      setActiveTicket(newTicket);
      navigateTo('TICKET_DISPLAY');
    } catch (err) {
      console.error(err);
      alert('Failed to generate ticket. Please try again.');
    }
  };

  // --- BUSINESS LOGIC: DRIVER ---

  const handleAcceptRequest = (requestId, driverUserId) => {
    // RACE CONDITION CHECK
    const requestIndex = driverRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return; // Gone?

    const request = driverRequests[requestIndex];
    if (request.status !== 'PENDING') return; // Already taken

    // LOCK IT
    const updatedRequest = { ...request, status: 'APPROVED', driverId: driverUserId };
    const updatedRequests = [...driverRequests];
    updatedRequests[requestIndex] = updatedRequest;
    setDriverRequests(updatedRequests);

    // UPDATE TICKET
    const ticketIndex = tickets.findIndex(t => t.ticketNumber === request.ticketNo);
    const updatedTickets = [...tickets];
    updatedTickets[ticketIndex] = { ...updatedTickets[ticketIndex], status: 'DRIVER_ASSIGNED' };
    setTickets(updatedTickets);
  };

  // --- BUSINESS LOGIC: SUPER ADMIN ---
  // const handleAddManager = (userData) => {
  //   // Create user with role MANAGER
  //   const newUser = { ...userData, id: `u-${Date.now()}`, role: 'MANAGER' };
  //   // Create Manager entry (Pending until assigned)
  //   const newManager = { userId: newUser.id, status: 'PENDING' };

  //   setUsers([...users, newUser]);
  //   setManagers([...managers, newManager]);
  // };

  // const handleCreateArea = (areaData, managerUserId) => {
  //   // Create Area
  //   const newArea = { ...areaData, id: `area-${Date.now()}`, managerId: managerUserId };
  //   setParkingAreas([...parkingAreas, newArea]);

  //   // Update Manager Status to ACTIVE
  //   const updatedManagers = managers.map(m =>
  //     m.userId === managerUserId ? { ...m, status: 'ACTIVE' } : m
  //   );
  //   setManagers(updatedManagers);
  // };

  // const handleApproveDriver = (driverUserId) => {
  //   // This assumes there's a flow to add a PENDING Driver. 
  //   // For now, let's assume SuperAdmin can just create the driver entirely or flip status.
  //   // Based on requirement: Manager sends request -> Admin approves.
  //   // So we need "addPendingDriver" action from Manager.
  //   const updatedDrivers = drivers.map(d =>
  //     d.userId === driverUserId ? { ...d, status: 'AVAILABLE' } : d
  //   );
  //   setDrivers(updatedDrivers);
  // };

  // --- BUSINESS LOGIC: MANAGER ---
  // const handleRequestAddDriver = (driverUserData, parkingAreaId) => {
  //   // Create User (Driver)
  //   const newUser = { ...driverUserData, id: `u-${Date.now()}`, role: 'DRIVER' };
  //   // Create Driver (Pending Validation/Approval)
  //   const newDriver = { userId: newUser.id, parkingAreaId, status: 'INACTIVE', dlNumber: driverUserData.dlNumber };

  //   setUsers([...users, newUser]);
  //   setDrivers([...drivers, newDriver]);
  //   // Note: Real world would have a specific "Approval Request" object or just filter drivers by status 'INACTIVE'
  // };


  // --- RENDERER ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <LoginScreen onLogin={handleLogin} onNavigate={navigateTo} />;

      // USER FLOW
      case 'USER_DASHBOARD':
        return (
          <Dashboard
            user={currentUser}
            activeTicket={activeTicket} // Find actual active ticket from state?
            onNavigate={navigateTo}
          />
        );
      case 'SCAN_QR':
        return <ScanQR onScanSuccess={handleScanSuccess} onCancel={() => navigateTo('USER_DASHBOARD')} />;
      case 'SELECT_CAR':
        // Removed handleAddCar prop to fix ReferenceError
        // SelectCar fetches its own cars initially, but App fetches them for BusinessInfo
        return <SelectCar cars={cars}
          onAddCar={handleAddCar}
          onNavigate={navigateTo} />;
      case 'MAKE_PAYMENT':
        return <MakePayment onPay={handlePaymentSuccess} onNavigate={navigateTo} amount={bookingFlow.amount} />;
      case 'TICKET_DISPLAY':
        return <Ticket ticket={activeTicket} onNavigate={navigateTo} />;
      // ROLE DASHBOARDS
      case 'MANAGER_DASHBOARD':
        return <ManagerDashboard user={currentUser} />;
      case 'DRIVER_DASHBOARD': {
        return (
          <DriverDashboard
            user={currentUser}
          />
        )
      };
      case 'SUPERADMIN_DASHBOARD':
        return (
          <SuperAdminDashboard />
        );
      case 'REGISTER':
        return <Register onNavigate={navigateTo} />;
      case 'BUSINESS_INFO': {
        const selectedCar = cars.find(c => c.id === bookingFlow.carId);
        const selectedArea = scannedArea;
        return (
          <BusinessInfo
            car={selectedCar}
            parkingArea={selectedArea}
            onNavigate={navigateTo}
          />
        );
      }
      default:
        return <div>Screen {currentScreen} not found</div>;
    }
  };

  const isAuthScreen = !['LOGIN', 'REGISTER'].includes(currentScreen);

  return (
    <div className="App">
      {isAuthScreen ? (
        <Layout
          onBack={history.length > 1 ? goBack : null}
          onDashboard={() => {
            setHistory([`${currentUser.role}_DASHBOARD`]);
            setCurrentScreen(`${currentUser.role}_DASHBOARD`);
            localStorage.setItem('currentScreen', `${currentUser.role}_DASHBOARD`);
          }} // Quick reset
          onLogout={handleLogout}
          showBack={history.length > 1}
          title={`${currentUser?.role} Dashboard`}
        >
          {renderScreen()}
        </Layout>
      ) : renderScreen()}
    </div>
  );
}

export default App;