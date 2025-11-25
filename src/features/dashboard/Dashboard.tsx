// src/features/dashboard/Dashboard.tsx
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAllEmployees, selectActiveEmployees } from '../employees/employeeSlice';
import { selectDepartmentStats } from '../departments/departmentSlice';
import { selectPendingLeaves, selectLeaveStats  } from '../leaves/leaveSlice';
// import { Department } from '../employees/employeeTypes';

const Dashboard: React.FC = () => {
  const employees = useAppSelector(selectAllEmployees);
  const activeEmployees = useAppSelector(selectActiveEmployees);
  const deptStats = useAppSelector(selectDepartmentStats);
  const leaveStats = useAppSelector(selectLeaveStats);
  const pendingLeaves = useAppSelector(selectPendingLeaves);

  // Calculate department distribution
  const deptDistribution: Record<string, number> = {};
  employees.forEach(emp => {
    const dept = emp.department as string;
    deptDistribution[dept] = (deptDistribution[dept] || 0) + 1;
  });

  // Calculate average salary
  const avgSalary = employees.length > 0
    ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
    : 0;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>📊 HR Dashboard</h1>
      
      {/* Summary Cards */}
      <div style={gridStyle}>
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="👥"
          color="#2196F3"
          subtitle={`${activeEmployees.length} active`}
        />
        {/* <StatCard
          title="Departments"
          value={deptStats.totalDepartments}
          icon="🏢"
          color="#4CAF50"
          subtitle={`$${(deptStats.totalBudget / 1000000).toFixed(1)}M budget`}
        /> */}
        <StatCard
          title="Leave Requests"
          value={leaveStats.total}
          icon="📅"
          color="#FF9800"
          subtitle={`${pendingLeaves.length} pending`}
        />
        <StatCard
          title="Average Salary"
          value={`$${Math.round(avgSalary / 1000)}K`}
          icon="💰"
          color="#9C27B0"
          subtitle="per employee"
        />
      </div>

      {/* Department Distribution */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Department Distribution</h2>
        <div style={gridStyle}>
          {Object.entries(deptDistribution).map(([dept, count]) => (
            <div key={dept} style={deptCardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2196F3' }}>{dept}</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                {count}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {((count / employees.length) * 100).toFixed(1)}% of workforce
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Status Overview */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Leave Status Overview</h2>
        <div style={gridStyle}>
          <div style={leaveStatusCard}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Pending</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9800' }}>
              {leaveStats.pending}
            </div>
          </div>
          <div style={leaveStatusCard}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Approved</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
              {leaveStats.approved}
            </div>
          </div>
          <div style={leaveStatusCard}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Rejected</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>
              {leaveStats.rejected}
            </div>
          </div>
          <div style={leaveStatusCard}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Days</div>
            {/* <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
              {leaveStats.totalDays}
            </div> */}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Quick Stats</h2>
        <div style={infoBoxStyle}>
          <div style={infoItem}>
            <span style={infoLabel}>Avg Employees per Dept:</span>
            <span style={infoValue}>{deptStats.averageEmployeesPerDept.toFixed(1)}</span>
          </div>
          <div style={infoItem}>
            <span style={infoLabel}>Largest Department:</span>
            <span style={infoValue}>
              {deptStats.largestDepartment?.name} ({deptStats.largestDepartment?.employeeCount} employees)
            </span>
          </div>
          <div style={infoItem}>
            <span style={infoLabel}>Total Approved Leave Days:</span>
            <span style={infoValue}>{leaveStats.totalDays} days</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div style={{ ...statCardStyle, borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{subtitle}</div>}
      </div>
      <div style={{ fontSize: '48px' }}>{icon}</div>
    </div>
  </div>
);

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const deptCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const leaveStatusCard: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const infoItem: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #f0f0f0'
};

const infoLabel: React.CSSProperties = {
  color: '#666',
  fontSize: '14px'
};

const infoValue: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#333',
  fontSize: '14px'
};

export default Dashboard;