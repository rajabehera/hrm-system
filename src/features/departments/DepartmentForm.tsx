// src/features/departments/DepartmentForm.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addDepartment, updateDepartment } from './departmentSlice';
import { Department } from './departmentTypes';

interface DepartmentFormProps {
  department?: Department | null;
  onClose: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onClose }) => {
  const dispatch = useAppDispatch();
  const isEditing = !!department;

  const [formData, setFormData] = useState({
    name: '',
    description: '', // Initialize as empty string instead of undefined
    budget: 0,
    location: '', // Initialize as empty string instead of undefined
    employeeCount: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || '', // Provide fallback empty string
        budget: department.budget,
        location: department.location || '', // Provide fallback empty string
        employeeCount: department.employeeCount
      });
    }
  }, [department]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const deptData: Department = {
      id: department?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description, // This is now guaranteed to be a string
      budget: formData.budget,
      location: formData.location, // This is now guaranteed to be a string
      employeeCount: formData.employeeCount,
      createdAt: department?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: department?.status || 'active'
    };

    if (isEditing) {
      dispatch(updateDepartment(deptData));
    } else {
      dispatch(addDepartment(deptData));
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['budget', 'employeeCount'].includes(name) ? Number(value) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ... rest of your component code remains the same
  return (
    <div style={overlayStyle}>
      <div style={formContainerStyle}>
        <h2>{isEditing ? 'Edit Department' : 'Add New Department'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Engineering"
            />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Brief description of the department"
            />
            {errors.description && <span style={errorStyle}>{errors.description}</span>}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Budget ($) *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                style={inputStyle}
                min="0"
                step="1000"
              />
              {errors.budget && <span style={errorStyle}>{errors.budget}</span>}
            </div>

            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Employee Count</label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                style={inputStyle}
                min="0"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Building A, Floor 3"
            />
            {errors.location && <span style={errorStyle}>{errors.location}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}>
              {isEditing ? 'Update' : 'Add'} Department
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

// ... your styles remain the same
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
  maxWidth: '500px',
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

export default DepartmentForm;