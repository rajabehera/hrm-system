// src/features/employees/EmployeeList.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { deleteEmployee } from './employeeSlice';
import { Employee } from './employeeTypes';

interface EmployeeListProps {
  onEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onEdit }) => {
  const employees = useSelector((state: RootState) => state.employees.employees);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#f44336';
      case 'on-leave': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <div>
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="🔍 Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          style={selectStyle}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept === 'all' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      <div style={statsStyle}>
        <div>Total Employees: <strong>{filteredEmployees.length}</strong></div>
        <div>Active: <strong>{filteredEmployees.filter(e => e.status === 'active').length}</strong></div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div style={noDataStyle}>No employees found</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Position</th>
                <th style={thStyle}>Salary</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} style={trStyle}>
                  <td style={tdStyle}>
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td style={tdStyle}>{employee.email}</td>
                  <td style={tdStyle}>{employee.department}</td>
                  <td style={tdStyle}>{employee.position}</td>
                  <td style={tdStyle}>${employee.salary.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: getStatusColor(employee.status)
                    }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => onEdit(employee)}
                      style={editButtonStyle}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      style={deleteButtonStyle}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const filterContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  marginBottom: '20px',
  flexWrap: 'wrap'
};

const searchInputStyle: React.CSSProperties = {
  flex: '1',
  minWidth: '250px',
  padding: '12px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const selectStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  minWidth: '200px'
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px'
};

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '4px'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white'
};

const thStyle: React.CSSProperties = {
  backgroundColor: '#f5f5f5',
  padding: '15px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd'
};

const tdStyle: React.CSSProperties = {
  padding: '15px',
  borderBottom: '1px solid #eee'
};

const trStyle: React.CSSProperties = {
  transition: 'background-color 0.2s'
};

const statusBadgeStyle: React.CSSProperties = {
  padding: '5px 10px',
  borderRadius: '12px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '8px',
  fontSize: '14px'
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px',
  color: '#999',
  fontSize: '18px'
};

export default EmployeeList;