import React, { useEffect, useState, } from 'react';
import '../styles/AddEmployee.css';
import { CreateEmployee, Pincode, UpdateEmployee} from '../Api/auth';
import { Designation, FrontendDeveloper, BackendDeveloper } from '../constant/constant';

const AddEmployee = ({ onClose, onAddEmployee, onUpdateEmployee,editData}) => {
  const [newEmployee, setNewEmployee] = useState({
    employee_Name: editData?.employee_Name || '',
    email: editData?.email || '',
    employee_code: editData?.employee_code || '',
    phone_Number: editData?.phone_Number || '',
    dob: editData?.dob ? 
    formatDateSafely(editData.dob) : 
    '',
    joining_Date: editData?.joining_Date ? 
    formatDateSafely(editData.joining_Date) : 
    '',
    adress: {
      addressLine1: editData?.adress?.addressLine1 || '',
      areaName: editData?.adress?.areaName || '',
      place: editData?.adress?.place || '',
      district: editData?.adress?.district || '',
      pincode: editData?.adress?.pincode || '',
      state: editData?.adress?.state || '',
      country: editData?.adress?.country || ''
    },
    workDetails: {
      designation: editData?.workDetails?.designation || '',
      frontendDeveloper: editData?.workDetails?.frontendDeveloper || '',
      backendDeveloper: editData?.workDetails?.backendDeveloper || '',
      isActive: editData?.workDetails?.isActive ?? true
    }
  });

  // console.log(JSON.stringify(newEmployee));
  
  function formatDateSafely(dateValue) {
    try {

      if (typeof dateValue === 'number') {
     
        const date = new Date(dateValue * 1000);

        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } 

      else if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
      return '';
    } catch (error) {
      console.error("Date formatting error:", error);
      return '';
    }
  }
  const handlePincode = async (pin) => {
    try {
      if (pin) {
        const res = await Pincode(String(pin));
        setNewEmployee({
          ...newEmployee,
          adress: {
            ...newEmployee.adress,
            state: res.data.postOffice[0].state || '',
            country:res.data.postOffice[0].country || '',
            apiResponses: res.data
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (newEmployee.adress.pincode && newEmployee.adress.pincode.length === 6) {
      handlePincode(newEmployee.adress.pincode);
    }
  },[newEmployee.adress.pincode]);



  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
     
      const [parent, child] = name.split('.');
      
      
      if (child === 'designation') {
        setNewEmployee({
          ...newEmployee,
          [parent]: {
            ...newEmployee[parent],
            [child]: Number(value),
            frontendDeveloper: 1,
            backendDeveloper: 1
          }
        });
      } else if (parent === 'workDetails') {
        
        setNewEmployee({
          ...newEmployee,
          [parent]: {
            ...newEmployee[parent],
            [child]: Number(value)
          }
        });
      } else {
        setNewEmployee({
          ...newEmployee,
          [parent]: {
            ...newEmployee[parent],
            [child]: value
          }
        });
      }
    } else {
      // Handle top-level fields
      setNewEmployee({
        ...newEmployee,
        [name]: value
      });
    }
  };

  // Special handler for frontend/backend developer dropdowns to ensure they're numbers
  const handleDeveloperChange = (field, value) => {
    setNewEmployee({
      ...newEmployee,
      workDetails: {
        ...newEmployee.workDetails,
        [field]: Number(value)
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...newEmployee,
      id: editData?.id,
      dob: newEmployee.dob ? Math.floor(new Date(newEmployee.dob).getTime() / 1000) : "",
      joining_Date: newEmployee.joining_Date ? Math.floor(new Date(newEmployee.joining_Date).getTime() / 1000) : "",
      workDetails: {
        ...newEmployee.workDetails,
        frontendDeveloper: Number(newEmployee.workDetails.frontendDeveloper),
        backendDeveloper: Number(newEmployee.workDetails.backendDeveloper)
      },
      adress: {
       ...newEmployee.adress,
       apiResponses: newEmployee.adress.place
      }
    };    
    try {

      if(editData) {
      
        
        const res = await UpdateEmployee(payload)
  
        
        if (res && res.status === 200) {
          onUpdateEmployee();
          onClose();
        }
      }else{
        const res = await CreateEmployee(payload)
        if (res && res.status === 200) {
          onAddEmployee();
          onClose();
        }
      }
      
      
    } catch (error) {
      console.error("Error adding employee:", error);
  
    }
    // onClose();
  };

  // Filter out "NotFrontend" and "NotBackend" options from the respective dropdowns
  const filteredFrontendOptions = Object.entries(FrontendDeveloper).filter(([key]) => key !== "1");
  const filteredBackendOptions = Object.entries(BackendDeveloper).filter(([key]) => key !== "1");

  const handlePlaceChange = (e) => {
    const selectedPlace = e.target.value;
    const postOffices = newEmployee.adress.apiResponses?.postOffice || [];
    
    const selectedPostOffice = postOffices.find(po => po.name === selectedPlace);
    
    if (selectedPostOffice) {
      setNewEmployee({
        ...newEmployee,
        adress: {
          ...newEmployee.adress,
          place: selectedPlace,
          district: selectedPostOffice.district || '',
        }
      });
    }
  };
  const modalTitle = editData ? 'Edit Employee' : 'Add New Employee';

  return (
    <div className="add-employee-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employee_Name">Full Name</label>
                <input
                  type="text"
                  id="employee_Name"
                  name="employee_Name"
                  value={newEmployee.employee_Name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employee_code">Employee Code</label>
                <input
                  type="text"
                  id="employee_code"
                  name="employee_code"
                  value={newEmployee.employee_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone_Number">Phone Number</label>
                <input
                  type="text"
                  id="phone_Number"
                  name="phone_Number"
                  value={newEmployee.phone_Number}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <div className="date-input-container" onClick={() => document.getElementById('dob').focus()}>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={newEmployee.dob}
                    onChange={(e) => {
                      const date = e.target.value;
                      setNewEmployee({
                        ...newEmployee,
                        dob: date
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="joining_Date">Joining Date</label>
                <div className="date-input-container" onClick={() => document.getElementById('joining_Date').focus()}>
                  <input
                    type="date"
                    id="joining_Date"
                    name="joining_Date"
                    value={newEmployee.joining_Date}
                    onChange={(e) => {
                      const date = e.target.value;
                      setNewEmployee({
                        ...newEmployee,
                        joining_Date: date
                      });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Address Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.addressLine1">Address Line 1</label>
                <input
                  type="text"
                  id="adress.addressLine1"
                  name="adress.addressLine1"
                  value={newEmployee.adress.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adress.areaName">Area Name</label>
                <input
                  type="text"
                  id="adress.areaName"
                  name="adress.areaName"
                  value={newEmployee.adress.areaName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.pincode">Pincode</label>
                <input
                  type="text"
                  id="adress.pincode"
                  name="adress.pincode"
                  value={newEmployee.adress.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
  <label htmlFor="adress.place">Place</label>
  <select
    id="adress.place"
    name="adress.place"
    value={newEmployee.adress.place}
    onChange={handlePlaceChange}
    required
  >
    <option value="">Select Place</option>
    {newEmployee.adress.apiResponses?.postOffice?.map((po, index) => (
      <option key={index} value={po.name}>
        {po.name}
      </option>
    ))}
  </select>
</div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.district">District</label>
                <input
                  type="text"
                  id="adress.district"
                  name="adress.district"
                  value={newEmployee.adress.district}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adress.state">State</label>
                <input
                  type="text"
                  id="adress.state"
                  name="adress.state"
                  value={newEmployee.adress.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.country">Country</label>
                <input
                  type="text"
                  id="adress.country"
                  name="adress.country"
                  value={newEmployee.adress.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Work Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="workDetails.designation">Designation</label>
                <select
                  id="workDetails.designation"
                  name="workDetails.designation"
                  value={newEmployee.workDetails.designation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Designation</option>
                  {Object.entries(Designation).map(([key, value]) => (
                    <option key={key} value={Number(key)}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {newEmployee.workDetails.designation === 1 && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="workDetails.frontendDeveloper">Frontend Skill</label>
                <select
                  id="workDetails.frontendDeveloper"
                  name="workDetails.frontendDeveloper"
                  value={newEmployee.workDetails.frontendDeveloper}
                  onChange={(e) => handleDeveloperChange('frontendDeveloper', e.target.value)}
                  required
                >
                  {/* Filter out "NotFrontend" (index 1) */}
                  {filteredFrontendOptions.map(([key, value]) => (
                    <option key={key} value={Number(key)}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {newEmployee.workDetails.designation === 2 && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="workDetails.backendDeveloper">Backend Skill</label>
                <select
                  id="workDetails.backendDeveloper"
                  name="workDetails.backendDeveloper"
                  value={newEmployee.workDetails.backendDeveloper}
                  onChange={(e) => handleDeveloperChange('backendDeveloper', e.target.value)}
                  required
                >
                  {/* Filter out "NotBackend" (index 1) */}
                  {filteredBackendOptions.map(([key, value]) => (
                    <option key={key} value={Number(key)}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workDetails.isActive">Status</label>
              <select
                id="workDetails.isActive"
                name="workDetails.isActive"
                value={newEmployee.workDetails.isActive}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  workDetails: {
                    ...newEmployee.workDetails,
                    isActive: e.target.value === "true"
                  }
                })}
                required
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
            {editData ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;