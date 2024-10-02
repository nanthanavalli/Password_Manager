const isEmail = (email) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

const isPassword = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
    password
  );
};

const isUsername = (username) => {
  return /^[a-zA-Z0-9_-]{3,16}$/.test(username);
};

module.exports = { isEmail, isPassword, isUsername };
