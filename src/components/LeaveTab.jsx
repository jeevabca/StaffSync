import React, { useState, useEffect } from 'react';
import '../styles/LeaveTab.css';
import { LeaveCreate, Leavegetall, LeaveUpdate } from '../Api/auth';
import { CreateIcon, edit } from '../constant/constant';

const LeaveTab = () => {

  const [leaveData, setLeaveData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [newLeave, setNewLeave] = useState({
    leave_type: 1, 
    no_of_days: 0
  });

  const getAllLeave = async () => {
    try {
      const res = await Leavegetall();
      // console.log(res);
      
      if (res.status === 200) {
        setLeaveData(res.data);
      }
    }catch (error) {
      console.log(error);
    }
  };

  const createLeave = async (leave) => {
    try {
      const res = await LeaveCreate(leave);
      console.log(JSON.stringify(res.data));
    }catch (error) {
      console.log(error);
    }
  };

  const updateLeave = async (leave) => {
    
    try {
      const res = await LeaveUpdate(leave);
      console.log(JSON.stringify(res.data));
      
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    getAllLeave();
  }, []);

 
  const handleCardClick = (leave) => {
    setSelectedLeave(leave);
    setShowEditPopup(true);
  }; 
  const handleCreateLeave = () => {
    setShowPopup(true);
    };

    const handleClosePopup = () => {
      setShowPopup(false);
     
      setNewLeave({
        leave_type: 1,
        no_of_days: 0
      });
    };

    const handleCloseEditPopup = () => {
      setShowEditPopup(false);
      setSelectedLeave(null);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewLeave({
        ...newLeave,
        [name]: name === 'leave_type' || name === 'no_of_days' ? 
          (value === '' ? 0 : parseInt(value)) : value
      });
    };

    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setSelectedLeave({
        ...selectedLeave,
        [name]: name === 'leave_type' || name === 'no_of_days' ? 
          (value === '' ? 0 : parseInt(value)) : value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createLeave(newLeave);
        console.log('Submitting new leave:', newLeave);
        await getAllLeave(); // Wait for the data to be fetched after creation
        handleClosePopup();
      } catch (error) {
        console.error('Error creating leave:', error);
      }
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        const updateData = {
          id: selectedLeave.id,
          leave_type: selectedLeave.leave_type,
          no_of_days: selectedLeave.no_of_days,
          updateOn: Math.floor(Date.now() / 1000) 
        };
        await updateLeave(updateData);
        console.log('Updating leave:', updateData);
        await getAllLeave(); 
        handleCloseEditPopup();
      } catch (error) {
        console.error('Error updating leave:', error);
      }
    };
  

  // Function to format timestamp to readable date
  const formatDate = (timestamp) => {
    // ... existing code ...
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get leave type name
  const getLeaveTypeName = (typeId) => {
    // ... existing code ...
    switch(typeId) {
      case 1:
        return ' 🏖️ Personal Leave';
      case 2:
        return ' 🤒 Sick Leave';
      case 3:
        return 'Festival Leave';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="leave-tab-container">
      <div className="leave-header">
        <h2>Employee Leave Information</h2>
        <button className="create-leave-btn" onClick={handleCreateLeave}>
          <div dangerouslySetInnerHTML={{ __html: CreateIcon }} />
          Create Leave
        </button>
      </div>
      
      <div className="leave-cards-container">
        {leaveData.map(leave => (
          <div key={leave.id} className={`leave-card leave-type-${leave.leave_type}`} onClick={() => handleCardClick(leave)}>
            <div className="leave-card-header">
              <h3>{getLeaveTypeName(leave.leave_type)}</h3>
              <div className='menu-dots' dangerouslySetInnerHTML={{ __html: edit }} />
            </div>
            <div className="leave-card-body">
              <div className="leave-info">
                <span className="leave-label">Available Days:</span>
                <span className="leave-value">{leave.no_of_days}</span>
              </div>
              <div className="leave-info">
                <span className="leave-label">Last Updated:</span>
                <span className="leave-value">{formatDate(leave.updateOn)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Create New Leave</h3>
              <button className="close-btn" onClick={handleClosePopup}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="leave_type">Leave Type</label>
                <select 
                  id="leave_type" 
                  name="leave_type" 
                  value={newLeave.leave_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>Personal Leave</option>
                  <option value={2}>Sick Leave</option>
                  <option value={3}>Festival Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="no_of_days">Number of Days</label>
                <input 
                  type="number" 
                  id="no_of_days" 
                  name="no_of_days" 
                  value={newLeave.no_of_days}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleClosePopup}>Cancel</button>
                <button type="submit" className="submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

       {/* Edit Leave Popup */}
       {showEditPopup && selectedLeave && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Edit Leave</h3>
              <button className="close-btn" onClick={handleCloseEditPopup}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit_leave_type">Leave Type</label>
                <select 
                  id="edit_leave_type" 
                  name="leave_type" 
                  value={selectedLeave.leave_type}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value={1}>Personal Leave</option>
                  <option value={2}>Sick Leave</option>
                  <option value={3}>Festival Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit_no_of_days">Number of Days</label>
                <input 
                  type="number" 
                  id="edit_no_of_days" 
                  name="no_of_days" 
                  value={selectedLeave.no_of_days}
                  onChange={handleEditInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseEditPopup}>Cancel</button>
                <button type="submit" className="submit-btn">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTab;