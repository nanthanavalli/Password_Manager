import { useEffect, useRef, useState } from "react";
import styles from "../styles/components/Modal.module.css";
import ReactDOM from "react-dom";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoChevronDown,
  IoEllipsisVertical,
  IoTrashOutline,
} from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onClick} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const backdropPortal = document.getElementById("backdrop");
const modalPortal = document.getElementById("modal");

const Modal = (props) => {
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [type, setType] = useState("Website");

  const typeValues = ["Website", "App", "Wifi", "Router", "Others"];
  const nameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const urlRef = useRef();
  const noteRef = useRef();

  useEffect(() => {
    if (props.data) {
      nameRef.current.value = props.data.name ? props.data.name : "";
      emailRef.current.value = props.data.email ? props.data.email : "";
      passwordRef.current.value = props.data.password
        ? props.data.password
        : "";
      usernameRef.current.value = props.data.username
        ? props.data.username
        : "";
      urlRef.current.value = props.data.url ? props.data.url : "";
      noteRef.current.value = props.data.note ? props.data.note : "";
      if (props.data.type) {
        setType(props.data.type);
      }
    }
  }, [props.data]);

  const passwordRevealHandle = () => {
    setPasswordReveal((prev) => {
      return !prev;
    });
  };

  const dropdownHandle = () => {
    setIsTypeOpen((prev) => {
      return !prev;
    });
  };

  const addPassword = () => {
    if (nameRef.current.value.trim().length === 0) {
      return toast("Name is required");
    }
    setIsLoading(true);
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "/home/passwords",
        {
          name: nameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          url: urlRef.current.value,
          note: noteRef.current.value,
          type: type,
        },
        { headers: { Authorization: token } }
      )
      .then((result) => {
        props.addPassword({
          _id: result.data.newId,
          name: nameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          url: urlRef.current.value,
          note: noteRef.current.value,
          type: type,
        });
        setIsLoading(false);
        props.modalHandle();
      })
      .catch((error) => {
        props.modalHandle();
        setIsLoading(false);
        toast(error.response.data.error);
      });
  };

  const editPassword = () => {
    setIsLoading(true);
    axios
      .patch(
        process.env.REACT_APP_API_BASE_URL + "/home/passwords",
        {
          _id: props.data._id,
          name: nameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          url: urlRef.current.value,
          note: noteRef.current.value,
          type: type,
        },
        { headers: { Authorization: token } }
      )
      .then((result) => {
        props.editPassword({
          _id: props.data._id,
          name: nameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          url: urlRef.current.value,
          note: noteRef.current.value,
          type: type,
        });
        props.modalHandle();
        setIsLoading(false);
      })
      .catch((error) => {
        props.modalHandle();
        console.log(error);
        setIsLoading(false);
        toast(error.response.data.error);
      });
  };

  const deletePassword = () => {
    axios
      .delete(
        process.env.REACT_APP_API_BASE_URL +
          "/home/passwords/" +
          props.data._id,
        { headers: { Authorization: token } }
      )
      .then(() => {
        props.modalHandle();
        props.deletePassword(props.data._id);
        console.log("Success");
      })
      .catch((error) => {
        toast(error.response.data.error);
        props.modalHandle();
        console.log("error");
      });
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      {props.closeOnOutsideClick
        ? ReactDOM.createPortal(
            <Backdrop onClick={props.modalHandle} />,
            backdropPortal
          )
        : ReactDOM.createPortal(<Backdrop />, backdropPortal)}

      {ReactDOM.createPortal(
        <ModalOverlay onClick={props.onClick}>
          <div className={styles.input_menu_div}>
            <input
              className={styles.modalName_input}
              placeholder="Name"
              ref={nameRef}
            />
            {props.data && (
              <div style={{ position: "relative" }}>
                <button
                  className={styles.menu_button}
                  onClick={() => {
                    setIsDeleteOpen((prev) => {
                      return !prev;
                    });
                  }}
                >
                  <IoEllipsisVertical
                    style={{ height: "20px", width: "20px" }}
                  />
                </button>
                {isDeleteOpen && (
                  <button
                    className={styles.delete_button}
                    onClick={deletePassword}
                  >
                    <IoTrashOutline className={styles.delete_icon} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            className={styles.modal_input}
            placeholder="Username"
            ref={usernameRef}
          />
          <input
            className={styles.modal_input}
            placeholder="Email"
            ref={emailRef}
          />
          <div className={styles.passwordInputDiv}>
            <input
              className={styles.modal_input}
              type={passwordReveal ? "text" : "password"}
              placeholder="Password"
              ref={passwordRef}
            />
            {passwordReveal ? (
              <IoEyeOffOutline
                className={styles.eyeIcon}
                onClick={passwordRevealHandle}
              />
            ) : (
              <IoEyeOutline
                className={styles.eyeIcon}
                onClick={passwordRevealHandle}
              />
            )}
          </div>
          <input
            className={styles.modal_input}
            placeholder="URL"
            ref={urlRef}
          />
          <input
            className={styles.modal_input}
            placeholder="Note"
            ref={noteRef}
          />
          <div className={styles.modalLastRow}>
            <div className={styles.dropdown} onClick={dropdownHandle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "rgb(255, 255, 255,0.6)",
                }}
              >
                {type}
                <IoChevronDown />
              </div>
              {isTypeOpen && (
                <div className={styles.dropdownContent}>
                  {typeValues.map((type) => (
                    <p
                      className={styles.dropdownValue}
                      onClick={(e) => {
                        setType(e.currentTarget.innerHTML);
                      }}
                    >
                      {type}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`${styles.modal_button} ${
                isLoading ? styles.disabled : styles.close
              }`}
              onClick={props.modalHandle}
              disabled={isLoading ? true : false}
            >
              Close
            </button>

            <button
              className={`${styles.modal_button} ${
                isLoading ? styles.disabled : styles.save
              }`}
              onClick={props.data === undefined ? addPassword : editPassword}
              disabled={isLoading ? true : false}
            >
              Save
            </button>
          </div>
        </ModalOverlay>,
        modalPortal
      )}
    </>
  );
};

export default Modal;
