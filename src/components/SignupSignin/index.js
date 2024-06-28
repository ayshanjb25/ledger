import React, { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import "./styles.css";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  const signupWithEmail = () => {
    setLoading(true);
    // console.log(name);
    // console.log(email);
    // console.log(password);
    // console.log(confirmPassword);
    // Authenticate the user, or basically create a new account using email and password
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
            toast.success("User Created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
            // Create a doc with user id as the following id
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password and Confirm Password don't match!");
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  };

  const loginWithEmail = () => {
    console.log(email);
    console.log(password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  };

  const createDoc = async (user) => {
    setLoading(true);
    //Male sure that the doc with the uid doesn't exist
    //Create a doc
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      // const{displayName,email,photoURL} = user;
      // const createdAt = new Date();
      try {
        // Add a new document in collection "users"
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists!");
      setLoading(false);
    }
  };

  const googleAuth = () => {
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        createDoc(user);setLoading(false);
        navigate("/dashboard");
        toast.success("User authenticated!");
        
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
        // ...
      });
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
    
  };
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Log into <span style={{ color: "var(--theme)" }}>Ledger.</span>
          </h2>
          <form>
            <Input
              label={"Email"}
              type="email"
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              label={"Password"}
              type="password"
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              diasbled={loading}
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
              onClick={googleAuth}
            />{" "}
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Ledger.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              type="text"
              state={name}
              setState={setName}
              placeholder={"John Doe"}
            />
            <Input
              label={"Email"}
              type="email"
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              label={"Password"}
              type="password"
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              label={"Confirm Password"}
              type="password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              diasbled={loading}
              text={loading ? "Loading..." : "Signup using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading..." : "Signup using Google"}
              blue={true}
              onClick={googleAuth}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignUpSignIn;
