export const getPublicProfile = (userObject) => {
  const publicUser = {
    id: userObject.id,
    first_name: userObject.first_name,
    last_name: userObject.last_name,
    email: userObject.email,
  };
  return publicUser;
};

export default getPublicProfile;
