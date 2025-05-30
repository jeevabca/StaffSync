// const LeaveType = {
//   0: None,
//   1: PersonalLeave,
//   2: SickLeave,
// };
// const Role = {
//   0: None,
//   1: SuperAdmin,
//   2: Admin,
//   3: Manager,
//   4: Developer,
// };

export const Designation = {
  0: "None",
  1: "FrontendDeveloper",
  2: "BackendDeveloper",
  3: "Management",
  4: "Database",
  5: "DigitalMarketing",
  6: "UIUXDesign",
  7: "DevOps",
};

export const FrontendDeveloper = {
  0: "None",
  1: "NotFrontend",
  2: "Angular",
  3: "Android",
  4: "Flutter",
  5: "ReactNative",
  6: "iOS",
};

export const BackendDeveloper = {
  0: "None",
  1: "NotBackend",
  2: "Java",
  3: "DotNet",
  4: "NodeJs",
  5: "Python",
};

export const leaveTypes = [
  { id: 1, name: "Personal Leave" },
  { id: 2, name: "Sick Leave" },
];

export const Role = {
  None: 0,
  SuperAdmin: 1,
  Admin: 2,
  Manager: 3,
  Developer: 4,
  SuperDeveloper: 5,
  SuperManager: 6,
};

// svg image
export const edit = `
  <svg
    className="edit-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>`;

export const CreateIcon = `<svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>`;

export const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  <line x1="10" y1="11" x2="10" y2="17"></line>
  <line x1="14" y1="11" x2="14" y2="17"></line>
</svg>`;

export const DateConversion = (date) => {
  if (typeof date === "number") {
    const dateObj = new Date(date * 1000);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  } else if (typeof date === "string") {
    let dateObj;
    if (date.includes("-")) {
      dateObj = new Date(date);
    } else if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      throw new Error("Unsupported date format");
    }
    return Math.floor(dateObj.getTime() / 1000);
  } else {
    throw new Error("Invalid input type");
  }
};
