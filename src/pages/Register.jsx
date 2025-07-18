import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("worker"); // default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      // Save role and name in Firestore
      await setDoc(doc(db, "users", user.uid), { role, name });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Sign Up Handler
  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user exists in Firestore, if not, set default role
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, { role, name: user.displayName }); // Use selected role
      }
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "0",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#1976d2", marginBottom: "1.5rem" }}>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #bdbdbd",
            borderRadius: "0",
            fontSize: "1rem",
            background: "#f5f6fa",
            color: "#282c34",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #bdbdbd",
            borderRadius: "0",
            fontSize: "1rem",
            background: "#f5f6fa",
            color: "#282c34",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #bdbdbd",
            borderRadius: "0",
            fontSize: "1rem",
            background: "#f5f6fa",
            color: "#282c34",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1.5rem",
            border: "1px solid #bdbdbd",
            borderRadius: "0",
            fontSize: "1rem",
            background: "#f5f6fa",
            color: "#282c34",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <div style={{ marginBottom: "1.5rem", width: "100%", display: "flex", gap: "1rem" }}>
          <label style={{ color: "#1976d2", flex: 1 }}>
            <input
              type="radio"
              value="worker"
              checked={role === "worker"}
              onChange={() => setRole("worker")}
              style={{ marginRight: "0.5rem" }}
            />
            Worker
          </label>
          <label style={{ color: "#1976d2", flex: 1 }}>
            <input
              type="radio"
              value="client"
              checked={role === "client"}
              onChange={() => setRole("client")}
              style={{ marginRight: "0.5rem" }}
            />
            Client
          </label>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#f0f0f0",
            color: "#282c34",
            border: "none",
            borderRadius: "0",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
            marginBottom: "1rem",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e0e0e0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f0f0f0")}
        >
          Register
        </button>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#f0f0f0",
            color: "#1976d2",
            border: "1px solid #1976d2",
            borderRadius: "0",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#e0e0e0";
            e.currentTarget.style.color = "#125ea2";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.color = "#1976d2";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.45 2.36 30.6 0 24 0 14.82 0 6.73 5.38 2.69 13.19l7.98 6.2C12.36 13.13 17.74 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.41c-.54 2.91-2.18 5.38-4.65 7.04l7.19 5.59C43.98 37.36 46.1 31.41 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.67 28.39c-1.02-2.91-1.02-6.06 0-8.97l-7.98-6.2C.9 17.09 0 20.42 0 24c0 3.58.9 6.91 2.69 10.78l7.98-6.2z"
              />
              <path
                fill="#EA4335"
                d="M24 48c6.6 0 12.45-2.17 16.98-5.91l-7.19-5.59c-2.01 1.35-4.58 2.15-7.79 2.15-6.26 0-11.64-3.63-13.33-8.69l-7.98 6.2C6.73 42.62 14.82 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Sign up with Google
        </button>
      </form>
    </div>
  );
}