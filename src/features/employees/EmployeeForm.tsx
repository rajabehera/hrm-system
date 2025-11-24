// src/features/employees/EmployeeForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployee, updateEmployee } from './employeeSlice';
import { Employee } from './employeeTypes';

interface EmployeeFormProps {
  employee: Employee | null;
  onClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: 0,
    hireDate: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        hireDate: employee.hireDate,
        status: employee.status
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (employee) {
      dispatch(updateEmployee({
        ...formData,
        id: employee.id
      }));
    } else {
      dispatch(addEmployee({
        ...formData,
        id: Date.now().toString()
      }));
    }

    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>{employee ? '✏️ Edit Employee' : '➕ Add New Employee'}</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.email && <span style={errorStyle}>{errors.email}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.department && <span style={errorStyle}>{errors.department}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.position && <span style={errorStyle}>{errors.position}</span>}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Salary ($) *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                style={inputStyle}
                min="0"
                step="1000"
              />
              {errors.salary && <span style={errorStyle}>{errors.salary}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Hire Date *</label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.hireDate && <span style={errorStyle}>{errors.hireDate}</span>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={submitButtonStyle}>
              {employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #eee'
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#666'
};

const formStyle: React.CSSProperties = {
  padding: '20px'
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  marginBottom: '15px'
};

const fieldStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '14px'
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const errorStyle: React.CSSProperties = {
  color: '#f44336',
  fontSize: '12px',
  marginTop: '5px'
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid #eee'
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: 'white',
  color: '#666'
};

const submitButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontWeight: 'bold'
};

export default EmployeeForm;