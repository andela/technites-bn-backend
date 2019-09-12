export default (accessToken, refreshToken, profile, cb) => {
  // skiped profileUrl fb provide downloadable url
  const user = {
    firstname: profile.name.familyName,
    lastname: profile.name.givenName,
    email: profile.emails[0].value,
  };
  return cb(null, user);
};
