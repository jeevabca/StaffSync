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
