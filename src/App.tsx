// src/App.tsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import EmployeeList from './features/employees/EmployeeList';
import EmployeeForm from './features/employees/EmployeeForm';
import { Employee } from './features/employees/employeeTypes';

function AppContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={headerStyle}>
        <h1>🏢 HRM System</h1>
        <button onClick={handleAddNew} style={addButtonStyle}>
          + Add New Employee
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        <EmployeeList onEdit={handleEdit} />
      </main>

      {showForm && (
        <EmployeeForm 
          employee={editingEmployee} 
          onClose={handleCloseForm} 
        />
      )}
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

const headerStyle: React.CSSProperties = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontWeight: 'bold'
};

export default App;