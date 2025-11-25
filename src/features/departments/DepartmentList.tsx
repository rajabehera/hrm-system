// src/features/departments/DepartmentList.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { deleteDepartment } from './departmentSlice';
import { Department } from './departmentTypes';

interface DepartmentListProps {
  onEdit: (department: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ onEdit }) => {
  const departments = useSelector((state: RootState) => state.departments.departments);
  const employees = useSelector((state: RootState) => state.employees.employees);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = (id: string) => {
    const employeesInDept = employees.filter(emp => emp.department === departments.find(d => d.id === id)?.name);
    
    if (employeesInDept.length > 0) {
      alert(`Cannot delete department. ${employeesInDept.length} employee(s) are assigned to this department.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this department?')) {
      dispatch(deleteDepartment(id));
    }
  };

  const getEmployeeCount = (departmentName: string) => {
    return employees.filter(emp => emp.department === departmentName).length;
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || dept.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const statusOptions = ['all', 'active', 'inactive'];

  return (
    <div>
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="🔍 Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={selectStyle}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={statsStyle}>
        <div>Total Departments: <strong>{filteredDepartments.length}</strong></div>
        <div>Active: <strong>{filteredDepartments.filter(d => d.status === 'active').length}</strong></div>
        <div>Total Employees: <strong>{employees.length}</strong></div>
      </div>

      {filteredDepartments.length === 0 ? (
        <div style={noDataStyle}>No departments found</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Department Name</th>
                <th style={thStyle}>Manager</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Budget</th>
                <th style={thStyle}>Employees</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id} style={trStyle}>
                  <td style={tdStyle}>
                    {/* <span style={codeStyle}>{department.code}</span> */}
                  </td>
                  <td style={tdStyle}>
                    <strong>{department.name}</strong>
                  </td>
                  <td style={tdStyle}>{department.manager}</td>
                  <td style={tdStyle}>📍 {department.location}</td>
                  <td style={tdStyle}>${department.budget.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <span style={employeeCountStyle}>
                      {getEmployeeCount(department.name)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: getStatusColor(department.status)
                    }}>
                      {department.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => onEdit(department)}
                      style={editButtonStyle}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
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

const codeStyle: React.CSSProperties = {
  backgroundColor: '#e3f2fd',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#1976d2'
};

const employeeCountStyle: React.CSSProperties = {
  backgroundColor: '#fff3e0',
  padding: '4px 12px',
  borderRadius: '12px',
  fontWeight: 'bold',
  color: '#e65100',
  fontSize: '13px'
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

export default DepartmentList;