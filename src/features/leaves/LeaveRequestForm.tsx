// src/features/leaves/LeaveRequestForm.tsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addLeave } from './leaveSlice';
import { LeaveRequest, LeaveType, LeaveStatus } from './leaveTypes';
import { selectAllEmployees } from '../employees/employeeSlice';

interface LeaveRequestFormProps {
  onClose: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectAllEmployees);

  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: LeaveType.VACATION,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

 const days = calculateDays(formData.startDate, formData.endDate);
  
  const leaveRequest: LeaveRequest = {
    id: Date.now().toString(),
    employeeId: formData.employeeId,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    leaveType: formData.leaveType,
    startDate: formData.startDate,
    endDate: formData.endDate,
    numberOfDays: days, // Add this line
    reason: formData.reason,
    status: LeaveStatus.PENDING,
    appliedOn: new Date().toISOString()
  };
  

    dispatch(addLeave(leaveRequest));
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const days = calculateDays(formData.startDate, formData.endDate);

  return (
    <div style={overlayStyle}>
      <div style={formContainerStyle}>
        <h2>Apply for Leave</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - {emp.department}
                </option>
              ))}
            </select>
            {errors.employeeId && <span style={errorStyle}>{errors.employeeId}</span>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Leave Type *</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              style={inputStyle}
            >
              {Object.values(LeaveType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={inputStyle}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <span style={errorStyle}>{errors.startDate}</span>}
            </div>

            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={inputStyle}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <span style={errorStyle}>{errors.endDate}</span>}
            </div>
          </div>

          {days > 0 && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#E3F2FD', 
              borderRadius: '4px', 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <strong>Total Days: {days}</strong>
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Reason *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Provide a detailed reason for your leave request..."
            />
            {errors.reason && <span style={errorStyle}>{errors.reason}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}>
              Submit Leave Request
            </button>
            <button 
              type="button" 
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: '#757575' }}
            >
              Cancel
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
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const formContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'auto'
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  fontSize: '14px'
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '12px',
  marginTop: '4px'
};

const buttonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
};

export default LeaveRequestForm;