import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { FaUserCircle, FaEnvelope, FaUserTag, FaSave } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(currentUser);
          setName(userData.name || currentUser.displayName || "");
          setEmail(currentUser.email || "");
          setRole(userData.role || "worker");
          setBio(userData.bio || "");
          setPhotoURL(currentUser.photoURL || "");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name,
        bio,
      });
      // You might need to update the user's display name in auth as well
      // await updateProfile(auth.currentUser, { displayName: name });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="profile-photo" />
          ) : (
            <FaUserCircle className="profile-photo-placeholder" />
          )}
          <h2>{name || "User Profile"}</h2>
          <p className="role-badge">{role}</p>
        </div>

        <div className="profile-body">
          <div className="input-group">
            <FaUserCircle className="input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" value={email} disabled />
          </div>
          <div className="input-group">
            <FaUserTag className="input-icon" />
            <input type="text" value={role} disabled />
          </div>
          <div className="input-group">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="profile-footer">
          <button onClick={handleUpdate} disabled={loading} className="save-button">
            <FaSave />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <style>{`
        .profile-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .profile-card {
          background: white;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 500px;
          padding: 2.5rem;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .profile-photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 4px solid #4a6bdf;
        }
        .profile-photo-placeholder {
          font-size: 100px;
          color: #ccc;
          margin-bottom: 1rem;
        }
        .profile-header h2 {
          margin: 0;
          color: #2c3e50;
        }
        .role-badge {
          background: #4a6bdf;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          display: inline-block;
          margin-top: 0.5rem;
        }
        .profile-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-group {
          position: relative;
          margin-right: 3rem;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }
        .input-group input, .input-group textarea {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .input-group input:focus, .input-group textarea:focus {
          outline: none;
          border-color: #4a6bdf;
          box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
        }
        .input-group input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
        .profile-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .save-button {
          background: #4a6bdf;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .save-button:hover {
          background: #3a56c4;
          transform: translateY(-2px);
        }
        .save-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 1rem;
        }
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #4a6bdf;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
