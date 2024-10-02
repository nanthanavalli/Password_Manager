import styles from "../styles/pages/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { isEmail, isPassword } from "../util/validators";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [password, setPassword] = useState("");

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
  }, []);

  const handleLogin = async () => {
    if (!isEmail(email)) {
      return toast("Invalid Email");
    }
    if (!isPassword(password)) {
      return toast(
        "Password must have atleast 1 Uppercase, 1 Lowercase, 1 Special Character and 1 Numeric digit"
      );
    }

    axios
      .post(process.env.REACT_APP_API_BASE_URL + "/auth/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        navigate("/");
      })
      .catch((error) => {
        toast(error.response.data.error);
      });
  };

  return (
    <div className={styles.Auth}>
      <ToastContainer position="top-center" theme="dark" />
      <div className={styles.card}>
        <h2>Welcome!</h2>
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
        <button className={styles.filled_button} onClick={handleLogin}>
          Login
        </button>
        <hr className={styles.hr} />
        <Link to={"/auth/signup"} style={{ width: "100%" }}>
          <button className={styles.outline_button}>New user? Sign Up!</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
