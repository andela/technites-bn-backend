const getRoleName = (roleValue) => {
  let result;
  roleValue = Number(roleValue);
  switch (roleValue) {
    case 1:
      result = ['Requester'];
      break;
    case 2:
      result = ['Manager'];
      break;
    case 3:
      result = ['Requester', 'Manager'];
      break;
    case 4:
      result = ['Travel Administrator'];
      break;
    case 5:
      result = ['Travel Administrator', 'Requester'];
      break;
    case 6:
      result = ['Travel Administrator', 'Manager'];
      break;
    case 7:
      result = ['Superadmin'];
      break;

    default:
      result = null;
  }
  return result;
};

export default getRoleName;
