import styles from "../styles/components/Sidebar.module.css";
import PasswordModal from "./Password_Modal";
import { useState } from "react";
import {
  IoAdd,
  IoHomeOutline,
  IoSettingsOutline,
  IoCode,
  IoLogOutOutline,
} from "react-icons/io5";

import { useNavigate } from "react-router";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const [isModalOpen, setisModalOpen] = useState(false);

  const modalHandle = () => {
    setisModalOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <div className={styles.Sidebar}>
      {isModalOpen && (
        <PasswordModal
          modalHandle={modalHandle}
          closeOnOutsideClick={true}
          addPassword={props.addPassword}
        />
      )}
      <header className={styles.header}>
        <h2>Pass Guardian</h2>
        <p>An open source password manager</p>
      </header>
      <center>
        <button className={styles.addPassword_button} onClick={modalHandle}>
          <IoAdd style={{ width: "20px", height: "20px" }} />
          Add Password
        </button>
      </center>
      <div className={styles.navDiv}>
        <button className={styles.navItem + " " + styles.active}>
          <IoHomeOutline className={styles.navItemIcon} /> Home{" "}
        </button>
        <button className={styles.navItem}>
          <IoSettingsOutline className={styles.navItemIcon} /> Settings{" "}
        </button>
        <button className={styles.navItem}>
          <IoCode className={styles.navItemIcon} /> About us{" "}
        </button>
        <button className={styles.navItem} onClick={logout}>
          <IoLogOutOutline className={styles.navItemIcon} /> Logout{" "}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
