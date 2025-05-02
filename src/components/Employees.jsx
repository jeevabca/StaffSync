import React, { useEffect, useState } from 'react';
import '../styles/Employees.css';
import { Employeegetall ,DeleteEmployee} from '../Api/auth';
import { DateConversion ,Designation, FrontendDeveloper, BackendDeveloper} from '../constant/constant';
import AddEmployee from '../components/AddEmployee';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);


  const getallEmpolyees = async () => {
    try {
      setLoading(true);
      const res = await Employeegetall();
      console.log("from employee screen", JSON.stringify(res.data));
      setEmployees(res.data);
    } catch(e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getallEmpolyees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      setLoading(true);
      // Refresh the employee list after adding
      await getallEmpolyees();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {

      
      setLoading(true);
      // Refresh the employee list after adding
      await getallEmpolyees();
      setShowAddModal(false);
      setEditEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }finally {
      setLoading(false);
    }
  }


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.employee_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  const toggleExpandEmployee = (id) => {
    if (expandedEmployee === id) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(id);
    }
  };

  const toggleMenu = (id, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (employee, event) => {
    event.stopPropagation();
    // Implement edit functionality
    setEditEmployee(employee);
    setShowAddModal(true);
    setActiveMenu(null);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const data = { id: id };
      const res = await DeleteEmployee(data);
      console.log("from employee", res);
      
      if (res.status === 200) {  // Assuming your API returns status 200 on success
        // Update the local state to remove the deleted employee
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
        // Close any expanded view if the deleted employee was expanded
        if (expandedEmployee === id) {
          setExpandedEmployee(null);
        }
        // Close the action menu if it was open
        if (activeMenu === id) {
          setActiveMenu(null);
        }
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      // You might want to show an error message to the user here
    }
  };



  return (
    <div className="employees-container">
      
    <div className="employees-header">
      <h1>Employee Management</h1>
      <div className="header-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button 
          className="add-employee-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </button>
      </div>
    </div>

    {loading ? (
      <div className="loading-indicator">Loading...</div>
    ) : (
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Employee Code</th>
              <th>Designation</th>
              <th>Joining Date</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <React.Fragment key={employee.id}>
                <tr 
                  className={expandedEmployee === employee.id ? 'expanded-row' : ''}
                  onClick={() => toggleExpandEmployee(employee.id)}
                >
                  <td>{employee.employee_Name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.employee_code}</td>
                  <td>
  {Designation[employee.workDetails.designation] || 'Unknown'}
  {employee.workDetails.designation === 2 && employee.workDetails.backendDeveloper !== 1 && (
    <span className="tech-badge">
      {BackendDeveloper[employee.workDetails.backendDeveloper]}
    </span>
  )}
  {employee.workDetails.designation === 1 && employee.workDetails.frontendDeveloper !== 1 && (
    <span className="tech-badge">
      {FrontendDeveloper[employee.workDetails.frontendDeveloper]}
    </span>
  )}
</td>
                  <td>{DateConversion(employee.joining_Date)}</td>
                  <td>{employee.phone_Number}</td>
                  <td>
                    <div className="action-menu-container">
                      <button 
                        className="menu-dots-btn"
                        onClick={(e) => toggleMenu(employee.id, e)}
                      >
                        ⋮
                      </button>
                      {activeMenu === employee.id && (
                        <div className="action-menu">
                          <button 
                            onClick={(e) => handleEdit(employee, e)}
                            className="menu-item"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmployee(employee.id);
                            }}
                            className="menu-item delete"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedEmployee === employee.id && (

                  <tr className="details-row">
                    <td colSpan="7">
                      <div className="employee-details">
                        <div className="details-section">
                          <h3>Personal Information</h3>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Date of Birth:</span>
                              <span className="detail-value">{DateConversion(employee.dob)}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone:</span>
                              <span className="detail-value">{employee.phone_Number}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Status:</span>
                              <span className="detail-value">{employee.workDetails.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="details-section">
                          <h3>Address</h3>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Address:</span>
                              <span className="detail-value">{employee.adress.addressLine1}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Area:</span>
                              <span className="detail-value">{employee.adress.areaName}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Place:</span>
                              <span className="detail-value">{employee.adress.place}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">District:</span>
                              <span className="detail-value">{employee.adress.district || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Pincode:</span>
                              <span className="detail-value">{employee.adress.pincode}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">State:</span>
                              <span className="detail-value">{employee.adress.state}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Country:</span>
                              <span className="detail-value">{employee.adress.country}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="details-section">
  <h3>Work Details</h3>
  <div className="details-grid">
    <div className="detail-item">
      <span className="detail-label">Designation:</span>
      <span className="detail-value">{Designation[employee.workDetails.designation] || 'Unknown'}</span>
    </div>
    {employee.workDetails.designation === 1 && employee.workDetails.frontendDeveloper !== 1 && (
      <div className="detail-item">
        <span className="detail-label">Frontend Skill:</span>
        <span className="detail-value">{FrontendDeveloper[employee.workDetails.frontendDeveloper]}</span>
      </div>
    )}
    {employee.workDetails.designation === 2 && employee.workDetails.backendDeveloper !== 1 && (
      <div className="detail-item">
        <span className="detail-label">Backend Skill:</span>
        <span className="detail-value">{BackendDeveloper[employee.workDetails.backendDeveloper]}</span>
      </div>
    )}
  </div>
</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}

{showAddModal && (
        <AddEmployee
        onClose={() => {
          setShowAddModal(false);
          setEditEmployee(null);
        }}
          onAddEmployee={handleAddEmployee}
          onUpdateEmployee={handleUpdateEmployee}
          editData={editEmployee}
        />
      )}
  </div>
  );
};

export default Employees;