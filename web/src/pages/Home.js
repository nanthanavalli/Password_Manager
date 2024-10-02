import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import Password from "../components/Password";
import Password from "../components/Password";
import styles from "../styles/pages/Home.module.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    if (token) {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + "/auth/checkAuth", {
          headers: { Authorization: token },
        })
        .then(() => {})
        .catch((error) => {
          return navigate("/auth/login");
        });
    } else {
      return navigate("/auth/login");
    }

    const getPasswords = () => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + "/home/passwords", {
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data !== null) {
            setPasswordList(result.data);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) {
            navigate("/auth/login");
          } else {
            toast(error.response.error);
          }
        });
    };

    getPasswords();
  }, [token, navigate]);

  const addPassword = (newPassword) => {
    setPasswordList((prev) => [...prev, newPassword]);
  };

  const editPassword = (updatedPassword) => {
    setPasswordList((prev) => {
      return prev.map((ele) => {
        if (ele._id === updatedPassword._id) {
          return updatedPassword;
        }
        return ele;
      });
    });
  };

  const deletePassword = (id) => {
    setPasswordList((prev) => {
      return prev.filter((ele) => {
        if (ele._id !== id) {
          return ele;
        }
      });
    });
  };

  return (
    <div className={styles.Home}>
      <ToastContainer position="top-center" theme="dark" />
      <Sidebar addPassword={addPassword} />
      <div className={styles.content}>
        <h1>Passwords</h1>
        <div className={styles.passwordGrid}>
          {passwordList.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <p>No Passwords</p>
            </div>
          )}
          {passwordList.map((password) => {
            return (
              <Password
                data={password}
                editPassword={editPassword}
                deletePassword={deletePassword}
                key={password._id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
