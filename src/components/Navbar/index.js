import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { Link,Navigate,useLocation,useNavigate } from "react-router-dom"; // Assuming you are using react-router for navigation
import cust from "../../assets/users.svg";
import account from "../../assets/user.svg";
import dboard from "../../assets/dashboard.svg";
import revenue from "../../assets/revenue.svg";
import signout from "../../assets/logout.svg";
import category from "../../assets/category.svg";
import './styles.css'
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div style={{ width: "12%", height: "100vh" }}>
     
      <Menu
        mode="vertical"
        style={{
          width: "10.5%",
          height: "100%",
          position: "fixed",
          fontSize: "18px",
          display:"flex",
          flexDirection:"column",
          
        }}
        
      >
        <div style={{diaplay:"flex",flexDirection:"column",gap:"200px"}}>
        <Menu.Item
          key="dashboard"
          // icon={<DashboardOutlined style={{ fontSize: "18px" }} />}
          style={{ marginTop: "2rem" , backgroundColor: location.pathname === "/dashboard" ? "var(--theme)" : "",
              color: location.pathname === "/dashboard" ? "#fff" : "",}}
        >
          <img src={dboard} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          key="customers"
          // icon={<UserOutlined style={{ fontSize: "18px" }} />}
          style={{ marginTop: "1rem"}}
        >
          <img src={cust} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="#">Customers</Link>
        </Menu.Item>
       
        <Menu.Item
          key="transactions"
          // icon={<RiseOutlined style={{ fontSize: "18px" }} />}
          style={{ marginTop: "1rem" , backgroundColor: location.pathname === "/transactions" ? "var(--theme)" : "",
              color: location.pathname === "/transactions" ? "#fff" : "",}}
        >
           <img src={revenue} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="/transactions">Transactions</Link>

          
        </Menu.Item>
        
        <Menu.Item
          key="categories"
          // icon={<AppstoreOutlined style={{ fontSize: "18px" }} />}
          style={{ marginTop: "1rem"}}
        ><img src={category} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="#">Categories</Link>
        </Menu.Item>
        <Menu.Item
          key="account"
          // icon={<AppstoreOutlined style={{ fontSize: "18px" }} />}
          style={{ marginTop: "1rem"}}
        ><img src={account} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="/account">Account</Link>
        </Menu.Item>
        
        </div>

        <div style={{justifyContent:"flex-end"}}> <Menu.Item
          key="logout"
          // icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
        ><img src={signout} style={{width:"25px",height:"25px",marginRight:"20px",color:"var(--theme)"}}/>
          <Link to="#" onClick={logoutFnc}>Logout</Link>
        </Menu.Item></div>
      </Menu> 
    </div>
  );
};

export default Navbar;
