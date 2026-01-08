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

// --- MOCK DATABASE INITIALIZATION ---

const INITIAL_USERS = [
  { id: 'u1', name: 'Alice User', email: 'user@test.com', password: '123', role: 'USER' },
  { id: 'm1', name: 'Bob Manager', email: 'manager@test.com', password: '123', role: 'MANAGER' },
  { id: 'd1', name: 'Dave Driver', email: 'driver@test.com', password: '123', role: 'DRIVER' },
  { id: 'a1', name: 'Super Admin', email: 'admin@test.com', password: '123', role: 'SUPERADMIN' }
];

// Manager Relation: userId link, status
const INITIAL_MANAGERS = [
  { userId: 'm1', status: 'ACTIVE' } // Assigned to Area 1
];

// Parking Area: Managed by m1
const INITIAL_AREAS = [
  { id: 'area1', name: 'Downtown Zone A', location: 'Main St', qrCode: 'AREA_ZONE_A_QR', managerId: 'm1', amount: '10' }
];

// Driver: userId link, parkingAreaId link, status
const INITIAL_DRIVERS = [
  { userId: 'd1', parkingAreaId: 'area1', status: 'AVAILABLE', dlNumber: 'DL-999' }
];

const INITIAL_CARS = [
  { id: 'c1', userId: 'u1', plate: 'ABC-1234', model: 'Toyota Camry', color: 'Silver' }
];

// Tickets & Requests (Dynamic)
const INITIAL_TICKETS = [];
const INITIAL_REQUESTS = [];

function App() {
  // --- CENTRALIZED STATE (Simulating Backend) ---
  const [users, setUsers] = useState(INITIAL_USERS);
  const [managers, setManagers] = useState(INITIAL_MANAGERS);
  const [parkingAreas, setParkingAreas] = useState(INITIAL_AREAS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [cars, setCars] = useState(INITIAL_CARS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [driverRequests, setDriverRequests] = useState(INITIAL_REQUESTS);

  // --- APP STATE ---
  const [currentUser, setCurrentUser] = useState(null); // The logged-in User object
  const [currentScreen, setCurrentScreen] = useState('LOGIN');
  const [history, setHistory] = useState([]);
  consol
  // --- USER FLOW STATE ---

  // When a user scans a QR, we store the resolved area here
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null); // Simplified User View

  // --- NAVIGATION ---
  const navigateTo = (screen, data = {}) => {
    if (screen == "LOGIN" || screen == "REGISTER") {
      setCurrentScreen(screen);
    }
    else {
      setHistory(prev => [...prev, screen]);
      setCurrentScreen(screen);
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
    setCurrentUser(null);
    setSelectedArea(null);
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
        const errData = await response.json();
        return { success: false, message: errData.error };
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

      // 🔐 Store token (client-side)
      localStorage.setItem('authToken', data.token);

      // Optional: keep token in state if needed
      // setAuthToken(data.token);

      // 🔹 Set logged-in user
      setCurrentUser(data.user);

      // 🔀 Route based on role (EXISTING FLOW)
      switch (data.user.role) {
        case 'SUPERADMIN':
          navigateTo('ADMIN_DASHBOARD');
          break;

        case 'MANAGER':
          navigateTo('MANAGER_DASHBOARD');
          break;

        case 'DRIVER':
          navigateTo('DRIVER_DASHBOARD');
          break;

        case 'USER':
          navigateTo('USER_DASHBOARD');
          break;

        default:
          // Fallback safety
          localStorage.removeItem('authToken');
          setCurrentUser(null);
          return { success: false, message: 'Unknown role' };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error' };
    }
  };

  // --- BUSINESS LOGIC: USER ---

  const handleScanSuccess = (qrCode) => {
    // Find area by qrCode
    const area = parkingAreas.find(a => a.qrCode === qrCode);
    if (area) {
      setSelectedArea(area);
      navigateTo('SELECT_CAR');
    } else {
      alert("Invalid QR Code"); // Basic feedback
    }
  };

  const handleAddCar = (carData) => new Promise((resolve) => {
    const newCar = { ...carData, id: `c-${Date.now()}`, userId: currentUser.id };
    setCars([...cars, newCar]);
    resolve();
  });

  const handlePaymentSuccess = (carId) => {
    // 1. Create Ticket
    const newTicket = {
      ticketNumber: `TKT-${Date.now()}`,
      status: 'CALLED', // waiting for driver
      carId: carId,
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
      parkingAreaId: selectedArea.id
    };

    // 2. Create Driver Request (Broadcast to Area)
    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestType: 'PARKING',
      ticketNo: newTicket.ticketNumber,
      driverId: null, // Broadcast
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      parkingAreaId: selectedArea.id // Helper for filtering
    };

    setTickets([...tickets, newTicket]);
    setDriverRequests([...driverRequests, newRequest]);
    setActiveTicket(newTicket);
    navigateTo('TICKET_DISPLAY');
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
  const handleAddManager = (userData) => {
    // Create user with role MANAGER
    const newUser = { ...userData, id: `u-${Date.now()}`, role: 'MANAGER' };
    // Create Manager entry (Pending until assigned)
    const newManager = { userId: newUser.id, status: 'PENDING' };

    setUsers([...users, newUser]);
    setManagers([...managers, newManager]);
  };

  const handleCreateArea = (areaData, managerUserId) => {
    // Create Area
    const newArea = { ...areaData, id: `area-${Date.now()}`, managerId: managerUserId };
    setParkingAreas([...parkingAreas, newArea]);

    // Update Manager Status to ACTIVE
    const updatedManagers = managers.map(m =>
      m.userId === managerUserId ? { ...m, status: 'ACTIVE' } : m
    );
    setManagers(updatedManagers);
  };

  const handleApproveDriver = (driverUserId) => {
    // This assumes there's a flow to add a PENDING Driver. 
    // For now, let's assume SuperAdmin can just create the driver entirely or flip status.
    // Based on requirement: Manager sends request -> Admin approves.
    // So we need "addPendingDriver" action from Manager.
    const updatedDrivers = drivers.map(d =>
      d.userId === driverUserId ? { ...d, status: 'AVAILABLE' } : d
    );
    setDrivers(updatedDrivers);
  };

  // --- BUSINESS LOGIC: MANAGER ---
  const handleRequestAddDriver = (driverUserData, parkingAreaId) => {
    // Create User (Driver)
    const newUser = { ...driverUserData, id: `u-${Date.now()}`, role: 'DRIVER' };
    // Create Driver (Pending Validation/Approval)
    const newDriver = { userId: newUser.id, parkingAreaId, status: 'INACTIVE', dlNumber: driverUserData.dlNumber };

    setUsers([...users, newUser]);
    setDrivers([...drivers, newDriver]);
    // Note: Real world would have a specific "Approval Request" object or just filter drivers by status 'INACTIVE'
  };


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
            bookings={[]}
            onNavigate={navigateTo}
          />
        );
      case 'SCAN_QR':
        return <ScanQR onScanSuccess={handleScanSuccess} onCancel={() => navigateTo('USER_DASHBOARD')} />;
      case 'SELECT_CAR':
        return <SelectCar cars={cars.filter(c => c.userId === currentUser.id)} onAddCar={handleAddCar} onNavigate={navigateTo} />;
      case 'MAKE_PAYMENT':
        return <MakePayment onPay={handlePaymentSuccess} onNavigate={navigateTo} />;
      case 'TICKET_DISPLAY':
        return <Ticket ticket={activeTicket} onNavigate={navigateTo} />;

      // ROLE DASHBOARDS
      case 'MANAGER_DASHBOARD':
        // Find assigned area
        const assignedArea = parkingAreas.find(p => p.managerId === currentUser.id);
        const managerInfo = managers.find(m => m.userId === currentUser.id);

        return (
          <ManagerDashboard
            user={currentUser}
            managerInfo={managerInfo}
            parkingArea={assignedArea}
            onAddDriver={handleRequestAddDriver}
            onNavigate={navigateTo}
          />
        );

      case 'DRIVER_DASHBOARD':
        // Find Driver Entry to get Area ID
        const driverProfile = drivers.find(d => d.userId === currentUser.id);
        // BROADCASST FILTER: status PENDING + same Area
        const areaRequests = driverRequests.filter(r =>
          r.status === 'PENDING' &&
          r.parkingAreaId === driverProfile?.parkingAreaId
        );
        return (
          <DriverDashboard
            user={currentUser}
            driverProfile={driverProfile}
            requests={areaRequests}
            onAccept={handleAcceptRequest}
            onNavigate={navigateTo}
          />
        );

      case 'ADMIN_DASHBOARD':
        return (
          <SuperAdminDashboard
            users={users}
            managers={managers}
            drivers={drivers}
            parkingAreas={parkingAreas}
            onAddManager={handleAddManager}
            onCreateArea={handleCreateArea}
            onApproveDriver={handleApproveDriver}
            onNavigate={navigateTo}
          />
        );
      case 'REGISTER':
        return <Register onNavigate={navigateTo} />;
      default:
        return <div>Screen {currentScreen} not found</div>;
    }
  };

  const isAuthScreen = currentScreen !== 'LOGIN' && currentScreen !== 'REGISTER';

  return (
    <div className="App">
      {isAuthScreen ? (
        <Layout
          onBack={history.length > 1 ? goBack : null}
          onDashboard={() => handleLogin(currentUser.email, currentUser.password)} // Quick reset
          onLogout={handleLogout}
          showBack={history.length > 1}
          title={currentUser ? `${currentUser.role} View` : 'Parking App'}
        >
          {renderScreen()}
        </Layout>
      ) : renderScreen()}
    </div>
  );
}

export default App;
