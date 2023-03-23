export const Gender = (value) => {
  switch (value) {
    case 1:
      return "Male";
    case 2:
      return "Female";
    case 3:
      return "Other";
    default:
      break;
  }
};
