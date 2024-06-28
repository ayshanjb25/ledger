import React, { useEffect } from "react";
import { auth } from "../../firebase";
import "./styles.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from '../../assets/user.svg'
import logo from '../../assets/logo3.png'

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/') {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, location]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <div style={{display:"flex", alignItems:"center", gap:"0.75rem"}}><img src={logo} style={{ height:"2rem", width:"3rem" }}/>
      <p className="logo">Ledger.</p></div>
      
      {user && (
        <div style={{display:"flex", alignItems:"center", gap:"0.75rem"}}>
          <img src={user.photoURL ? user.photoURL :userImg} style={{borderRadius:"50%", height:"1.5rem", width:"1.5rem" }}/>
        <p className="logo link" onClick={logoutFnc}>
          Logout
        </p></div>
      )}
    </div>
  );
};

export default Header;
