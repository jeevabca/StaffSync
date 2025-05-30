import React, { useEffect, useState } from 'react';
import '../styles/LeaveApplication.css';
import { DateConversion, leaveTypes } from '../constant/constant';
import { LeaveAppCreate,LeaveAppGetAll } from '../Api/auth';

const LeaveApplication = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const leaveGetAll = async () => {
    try {
      setLoading(true);
      const res = await LeaveAppGetAll();
      console.log('Leave application response:', JSON.stringify(res.data));
      if (res.data && res.data.responses) {
        setLeaveApplications(res.data.responses);
      }
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    leaveGetAll();
  },[])

  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getLeaveTypeName = (typeId) => {
    const leaveType = leaveTypes.find(type => type.id === typeId);
    return leaveType ? leaveType.name : 'Unknown';
  };

  const getStatusName = (statusId) => {
    switch(statusId) {
      case 1: return 'Approved';
      case 2: return 'Pending';
      case 3: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (statusId) => {
    switch(statusId) {
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 3: return 'status-rejected';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // ... existing code ...

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    return newErrors;
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Format data for API submission
    const submissionData = {
      employeeId: parseInt(formData.employeeId),
      leaveType: parseInt(formData.leaveType),
      startDate: new Date(formData.startDate).getTime() /1000,
      endDate: new Date(formData.endDate).getTime() / 1000,
      reason: formData.reason
    };
    console.log('Submitting leave application:', JSON.stringify(submissionData));
    
    const res = await LeaveAppCreate(submissionData);
    console.log('Leave application response:', res);
  
    // Show success message
    setSubmitted(true);
    
    // Reset form after submission
    setFormData({
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });

    leaveGetAll();
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
    if (!submitted) {
      setFormData({
        employeeId: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
    }
  };

  const handleStatusChange = async (applicationIndex, newStatus) => {
    try {
      // Create a copy of the applications array
      const updatedApplications = [...leaveApplications];
      
      // Update the status in the local state
      updatedApplications[applicationIndex] = {
        ...updatedApplications[applicationIndex],
        leaveStatus: parseInt(newStatus)
      };
      
      setLeaveApplications(updatedApplications);
      
      // Prepare data for API call
      const updateData = {
        employeeId: updatedApplications[applicationIndex].employeeId,
        leaveStatus: parseInt(newStatus)
      };
      
      // Call API to update status (you'll need to create this function in your auth.jsx)
      // const response = await LeaveAppUpdateStatus(updateData);
      
      // If API call fails, you might want to revert the local state
      // console.log('Status update response:', response);
      
    } catch (error) {
      console.error('Error updating leave status:', error);
      // Revert back to original state or show error message
      leaveGetAll(); // Refresh data from server
    }
  };

  return (
    <div className="leave-application-container">
      <div className="leave-header">
        <h1>Leave Management</h1>
        <button className="apply-leave-btn" onClick={() => setShowModal(true)}>
          Apply Leave
        </button>
      </div>

      <div className="leave-applications-table-container">
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading leave applications...</p>
          </div>
        ) : leaveApplications.length > 0 ? (
          <table className="leave-applications-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Create On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications.map((application, index) => (
                <tr key={index}>
                  <td>{application.employeeName} (ID: {application.employeeId})</td>
                  <td>{getLeaveTypeName(application.leaveType)}</td>
                  <td>{DateConversion(application.startDate)}</td>
                  <td>{DateConversion(application.endDate)}</td>
                  <td>{application.reason}</td>
                  <td>{DateConversion(application.createOn)}</td>
                  <td>
                    {isAdmin ? (
                      <select 
                        className={`status-dropdown ${getStatusClass(application.leaveStatus)}`}
                        value={application.leaveStatus}
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                      >
                        <option value="1">Approved</option>
                        <option value="2">Pending</option>
                        <option value="3">Rejected</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${getStatusClass(application.leaveStatus)}`}>
                        {getStatusName(application.leaveStatus)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">
            <p>No leave applications found.</p>
          </div>
        )}
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          // Close modal only if clicking on the overlay background
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Leave Application</h2>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>
            
            {submitted ? (
              <div className="success-message">
                <h2>Leave Application Submitted Successfully!</h2>
                <p>Your leave request has been submitted for approval.</p>
                <button onClick={resetForm} className="btn-primary">Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="leave-form">
                <div className="form-group">
                  <label htmlFor="employeeId">Employee ID</label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={errors.employeeId ? 'error' : ''}
                  />
                  {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="leaveType">Leave Type</label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className={errors.leaveType ? 'error' : ''}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  {errors.leaveType && <span className="error-message">{errors.leaveType}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={errors.startDate ? 'error' : ''}
                    />
                    {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={errors.endDate ? 'error' : ''}
                    />
                    {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="reason">Reason for Leave</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                    className={errors.reason ? 'error' : ''}
                  ></textarea>
                  {errors.reason && <span className="error-message">{errors.reason}</span>}
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Submit Application</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;