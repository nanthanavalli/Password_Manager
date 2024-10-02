import styles from "../styles/pages/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { isEmail, isPassword, isUsername } from "../util/validators";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + "/auth/checkAuth", {
          headers: { Authorization: token },
        })
        .then(() => {
          return navigate("/");
        })
        .catch((error) => {});
    }
  });

  const handleSignup = async () => {
    if (!isUsername(username)) {
      if(username.length>2){
        return toast("Username should not contain space")
      }
      return toast("Username should contain grater than 3 characters");
    }
    if (!isEmail(email)) {
      return toast("Invalid Email");
    }
    if (!isPassword(password)) {
      return toast(
        "Password must have atleast 1 Uppercase, 1 Lowercase, 1 Special Character and 1 Numeric digit"
      );
    }
    if (password !== confirmPassword) {
      return toast("Passwords don't match");
    }

    axios
      .post(process.env.REACT_APP_API_BASE_URL + "/auth/signup", {
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      })
      .then(() => {
        navigate("/auth/login");
      })
      .catch((error) => {
        toast(error.response.data.error);
      });
  };

  return (
    <div className={styles.Auth}>
      <ToastContainer position="top-center" theme="dark" />
      <div className={styles.card}>
        <h2>Manage all your password in one place!</h2>
        <input
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Master Password"
          className={styles.input}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Confirm Master Password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        <button className={styles.filled_button} onClick={handleSignup}>
          Signup
        </button>

        <hr className={styles.hr} />

        <Link to={"/auth/login"} style={{ width: "100%" }}>
          <button className={styles.outline_button}>
            Already a user? Login!
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
