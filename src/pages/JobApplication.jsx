import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to apply.");
      navigate("/login");
      return;
    }

    try {
      const jobDocRef = doc(db, "Jobs", jobId);
      const jobDoc = await getDoc(jobDocRef);
      if (!jobDoc.exists()) {
        toast.error("Job not found!");
        return;
      }
      const jobTitle = jobDoc.data().title;

      await addDoc(collection(db, "Applications"), {
        jobId,
        jobTitle,
        applicantId: user.uid,
        applicantName: name,
        applicantEmail: user.email,
        coverLetter,
        appliedAt: new Date(),
        status: "pending",
        approved: false,
      });
      toast.success("Application submitted successfully!");
      navigate("/approved");
    } catch (error) {
      toast.error("Failed to submit application.");
      console.error("Error submitting application: ", error);
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
        padding: "2rem 0",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "0",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
          minWidth: "320px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#222", marginBottom: "0.5rem", textAlign: "center" }}>
          Apply for Job
        </h2>
        <div style={{ color: "#888", fontSize: "0.95rem", textAlign: "center", marginBottom: "1.2rem" }}>
          Please fill in your details to apply
        </div>
        <input
          type="text"
          placeholder="Your Name"
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
            color: "#222",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <textarea
          placeholder="Cover Letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1.5rem",
            border: "1px solid #bdbdbd",
            borderRadius: "0",
            fontSize: "1rem",
            background: "#f5f6fa",
            color: "#222",
            outline: "none",
            transition: "border 0.2s",
            minHeight: "80px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#f0f0f0",
            color: "#222",
            border: "none",
            borderRadius: "0",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e0e0e0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f0f0f0")}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}