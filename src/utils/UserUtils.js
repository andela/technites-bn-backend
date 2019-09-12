export const getPublicProfile = (userObject) => {
  const publicUser = {
    id: userObject.id,
    firstname: userObject.firstname,
    lastname: userObject.lastname,
    username: userObject.username,
    email: userObject.email,
  };
  return publicUser;
};

export default getPublicProfile;
