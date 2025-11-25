// src/features/leaves/LeaveList.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { deleteLeave, approveLeave, rejectLeave, cancelLeave } from './leaveSlice';
import { LeaveRequest, LeaveStatus, LeaveType } from './leaveTypes';

interface LeaveListProps {
  onEdit?: (leave: LeaveRequest) => void;
  onView?: (leave: LeaveRequest) => void;
  isManagerView?: boolean;
  currentUserId?: string;
}

const LeaveList: React.FC<LeaveListProps> = ({ 
  onEdit, 
  onView,
  isManagerView = false,
  currentUserId 
}) => {
  const leaves = useSelector((state: RootState) => state.leaves.leaves);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [reviewComments, setReviewComments] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      dispatch(deleteLeave(id));
    }
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      dispatch(cancelLeave(id));
    }
  };

  const handleApprove = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowReviewModal(true);
  };

  const handleReject = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowReviewModal(true);
  };

  const confirmApproval = () => {
    if (selectedLeave && currentUserId) {
      dispatch(approveLeave({
        id: selectedLeave.id,
        reviewedBy: currentUserId,
        reviewComments: reviewComments || undefined
      }));
      closeReviewModal();
    }
  };

  const confirmRejection = () => {
    if (selectedLeave && currentUserId) {
      dispatch(rejectLeave({
        id: selectedLeave.id,
        reviewedBy: currentUserId,
        reviewComments: reviewComments || undefined
      }));
      closeReviewModal();
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedLeave(null);
    setReviewComments('');
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    const matchesType = filterType === 'all' || leave.leaveType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED: return '#4CAF50';
      case LeaveStatus.REJECTED: return '#f44336';
      case LeaveStatus.PENDING: return '#FF9800';
      case LeaveStatus.CANCELLED: return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED: return '✓';
      case LeaveStatus.REJECTED: return '✗';
      case LeaveStatus.PENDING: return '⏱';
      case LeaveStatus.CANCELLED: return '⊘';
      default: return '•';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const leaveTypes = ['all', ...Object.values(LeaveType)];
  const statusOptions = ['all', ...Object.values(LeaveStatus)];

  return (
    <div>
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="🔍 Search leave requests..."
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
              {status === 'all' ? 'All Status' : status}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={selectStyle}
        >
          {leaveTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </option>
          ))}
        </select>
      </div>

      <div style={statsStyle}>
        <div>Total Requests: <strong>{filteredLeaves.length}</strong></div>
        <div>Pending: <strong>{filteredLeaves.filter(l => l.status === LeaveStatus.PENDING).length}</strong></div>
        <div>Approved: <strong>{filteredLeaves.filter(l => l.status === LeaveStatus.APPROVED).length}</strong></div>
        <div>Rejected: <strong>{filteredLeaves.filter(l => l.status === LeaveStatus.REJECTED).length}</strong></div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div style={noDataStyle}>No leave requests found</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Employee</th>
                <th style={thStyle}>Leave Type</th>
                <th style={thStyle}>Start Date</th>
                <th style={thStyle}>End Date</th>
                <th style={thStyle}>Days</th>
                <th style={thStyle}>Applied On</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} style={trStyle}>
                  <td style={tdStyle}>
                    <strong>{leave.employeeName}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={leaveTypeStyle}>{leave.leaveType}</span>
                  </td>
                  <td style={tdStyle}>{formatDate(leave.startDate)}</td>
                  <td style={tdStyle}>{formatDate(leave.endDate)}</td>
                  <td style={tdStyle}>
                    {/* <span style={daysStyle}>{leave.days} {leave.days === 1 ? 'day' : 'days'}</span> */}
                  </td>
                  <td style={tdStyle}>{formatDate(leave.appliedOn)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: getStatusColor(leave.status)
                    }}>
                      {getStatusIcon(leave.status)} {leave.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={actionContainerStyle}>
                      {onView && (
                        <button
                          onClick={() => onView(leave)}
                          style={viewButtonStyle}
                          title="View Details"
                        >
                          👁️ View
                        </button>
                      )}
                      
                      {isManagerView && leave.status === LeaveStatus.PENDING && (
                        <>
                          <button
                            onClick={() => handleApprove(leave)}
                            style={approveButtonStyle}
                            title="Approve Leave"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave)}
                            style={rejectButtonStyle}
                            title="Reject Leave"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      
                      {!isManagerView && leave.status === LeaveStatus.PENDING && onEdit && (
                        <>
                          <button
                            onClick={() => onEdit(leave)}
                            style={editButtonStyle}
                            title="Edit Request"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleCancel(leave.id)}
                            style={cancelButtonStyle}
                            title="Cancel Request"
                          >
                            ⊘ Cancel
                          </button>
                        </>
                      )}
                      
                      {(leave.status === LeaveStatus.CANCELLED || 
                        leave.status === LeaveStatus.REJECTED) && (
                        <button
                          onClick={() => handleDelete(leave.id)}
                          style={deleteButtonStyle}
                          title="Delete Request"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedLeave && (
        <div style={modalOverlayStyle} onClick={closeReviewModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>
              Review Leave Request - {selectedLeave.employeeName}
            </h3>
            
            <div style={modalBodyStyle}>
              <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
              <p><strong>Duration:</strong> {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)}</p>
              {/* <p><strong>Days:</strong> {selectedLeave.days}</p> */}
              <p><strong>Reason:</strong> {selectedLeave.reason}</p>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Review Comments (Optional):</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  style={textareaStyle}
                  rows={4}
                  placeholder="Enter your comments here..."
                />
              </div>
            </div>
            
            <div style={modalActionsStyle}>
              <button
                onClick={confirmApproval}
                style={approveButtonStyle}
              >
                ✓ Approve Leave
              </button>
              <button
                onClick={confirmRejection}
                style={rejectButtonStyle}
              >
                ✗ Reject Leave
              </button>
              <button
                onClick={closeReviewModal}
                style={cancelModalButtonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
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
  minWidth: '180px'
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  flexWrap: 'wrap'
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
  padding: '6px 12px',
  borderRadius: '12px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px'
};

const leaveTypeStyle: React.CSSProperties = {
  backgroundColor: '#e3f2fd',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '500',
  color: '#1976d2'
};

const daysStyle: React.CSSProperties = {
  backgroundColor: '#fff3e0',
  padding: '4px 10px',
  borderRadius: '4px',
  fontWeight: 'bold',
  color: '#e65100',
  fontSize: '13px'
};

const actionContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap'
};

const viewButtonStyle: React.CSSProperties = {
  backgroundColor: '#9C27B0',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const approveButtonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const rejectButtonStyle: React.CSSProperties = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: '#9E9E9E',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px'
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px',
  color: '#999',
  fontSize: '18px'
};

// Modal Styles
const modalOverlayStyle: React.CSSProperties = {
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

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
};

const modalTitleStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '20px',
  color: '#333'
};

const modalBodyStyle: React.CSSProperties = {
  marginBottom: '25px'
};

const formGroupStyle: React.CSSProperties = {
  marginTop: '20px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333'
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  resize: 'vertical',
  fontFamily: 'inherit'
};

const modalActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const cancelModalButtonStyle: React.CSSProperties = {
  backgroundColor: '#757575',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default LeaveList;