// src/App.tsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Navbar from './components/Navbar';
import Dashboard from './features/dashboard/Dashboard';
import EmployeeList from './features/employees/EmployeeList';
import EmployeeForm from './features/employees/EmployeeForm';
import DepartmentList from './features/departments/DepartmentList';
import DepartmentForm from './features/departments/DepartmentForm';
import LeaveList from './features/leaves/LeaveList';
import LeaveRequestForm from './features/leaves/LeaveRequestForm';
import { Employee } from './features/employees/employeeTypes';
import { Department } from './features/departments/departmentTypes';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setShowDepartmentForm(true);
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handleCloseDepartmentForm = () => {
    setShowDepartmentForm(false);
    setEditingDepartment(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'employees':
        return (
          <div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Employee Management</h1>
              <button onClick={() => setShowEmployeeForm(true)} style={addButtonStyle}>
                + Add Employee
              </button>
            </div>
            <EmployeeList onEdit={handleEditEmployee} />
          </div>
        );
      
      case 'departments':
        return (
          <div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Department Management</h1>
              <button onClick={() => setShowDepartmentForm(true)} style={addButtonStyle}>
                + Add Department
              </button>
            </div>
            <DepartmentList onEdit={handleEditDepartment} />
          </div>
        );
      
      case 'leaves':
        return (
          <div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Leave Management</h1>
              <button onClick={() => setShowLeaveForm(true)} style={addButtonStyle}>
                + Request Leave
              </button>
            </div>
            <LeaveList />
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main>
        {renderContent()}
      </main>

      {showEmployeeForm && (
        <EmployeeForm 
          employee={editingEmployee} 
          onClose={handleCloseEmployeeForm} 
        />
      )}

      {showDepartmentForm && (
        <DepartmentForm 
          department={editingDepartment} 
          onClose={handleCloseDepartmentForm} 
        />
      )}

      {/* {showLeaveForm && (
        <LeaveRequestForm onClose={() => setShowLeaveForm(false)} />
      )} */}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const addButtonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontWeight: 'bold'
};

export default App;