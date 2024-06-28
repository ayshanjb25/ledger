import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Navbar from "../components/Navbar";
import { auth, db } from '../firebase';

const Account = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] =useState(null);

  useEffect(()=>{
    const currentUser =auth.currentUser; 
    if(currentUser){
      setUser(currentUser);
      fetchUserData(currentUser.uid);
    }
  },[]

  
  );


  const fetchUserData = async(userId)=>{
try{
  const userDoc = await getDoc(doc(db,'users',userId));
  if(userDoc.exists()){
    setUserData(userDoc.data());

  }else{
    console.log("No such user!")
  }
}catch(error){
  console.error("Error fetching user data:" , error)
}
  }
  return (
    <div>
      <Header/>
      <div style={{display:"flex", flexDirection:"row"}}>
        <Navbar/>
       
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <h2 className="greeting">Account</h2>
              <p className="subtext">
                Access and manage your account efficently.
              </p>

          
              
{user && (
 <div className='charts-wrapper'> <div> <h3>Profile</h3>
  <p>Email: {user.email}</p>
  {userData && (
    <>
      <p>Name: {userData.name}</p>
      <p>Other Info: {userData.otherInfo}</p>
      {/* Add other user data fields as needed */}
    </>
  )}</div>  </div>
)}</div>
              
       
            </div>
    </div>
  )
}

export default Account
