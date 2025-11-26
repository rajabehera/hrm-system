// src/components/MainLayout.tsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from '../features/dashboard/Dashboard';
import EmployeeList from '../features/employees/EmployeeList';
import EmployeeForm from '../features/employees/EmployeeForm';
import DepartmentList from '../features/departments/DepartmentList';
import DepartmentForm from '../features/departments/DepartmentForm';
import LeaveList from '../features/leaves/LeaveList';
import LeaveRequestForm from '../features/leaves/LeaveRequestForm';
import { NotFound } from './NotFound';
import { Employee } from '../features/employees/employeeTypes';
import { Department } from '../features/departments/departmentTypes';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCanManageEmployees } from '../features/auth/authSlice';
import { showSuccessToast } from '../features/toast/toastSlice';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const canManageEmployees = useAppSelector(selectCanManageEmployees);

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Get current page from path
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!canManageEmployees) {
      dispatch(showSuccessToast('You do not have permission to edit employees'));
      return;
    }
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleEditDepartment = (dept: Department) => {
    if (!canManageEmployees) {
      dispatch(showSuccessToast('You do not have permission to edit departments'));
      return;
    }
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route
            path="/employees"
            element={
              <div>
                <div style={headerStyle}>
                  <h1>Employee Management</h1>
                  {canManageEmployees && (
                    <button onClick={() => setShowEmployeeForm(true)} style={addButtonStyle}>
                      + Add Employee
                    </button>
                  )}
                </div>
                <EmployeeList onEdit={handleEditEmployee} />
              </div>
            }
          />
          
          <Route
            path="/departments"
            element={
              <div>
                <div style={headerStyle}>
                  <h1>Department Management</h1>
                  {canManageEmployees && (
                    <button onClick={() => setShowDepartmentForm(true)} style={addButtonStyle}>
                      + Add Department
                    </button>
                  )}
                </div>
                <DepartmentList onEdit={handleEditDepartment} />
              </div>
            }
          />
          
          <Route
            path="/leaves"
            element={
              <div>
                <div style={headerStyle}>
                  <h1>Leave Management</h1>
                  <button onClick={() => setShowLeaveForm(true)} style={addButtonStyle}>
                    + Request Leave
                  </button>
                </div>
                <LeaveList />
              </div>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Modals */}
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

      {showLeaveForm && (
         <LeaveRequestForm onClose={() => setShowLeaveForm(false)} />
      )}
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

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

export default MainLayout;