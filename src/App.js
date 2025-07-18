import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import JobListings from "./pages/jobs";  
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import JobApplication from "./pages/JobApplication";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Approved from "./pages/Approved";


function App() {
  return (
    <>
    <div><Toaster/></div>

    <Router>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob />} />
        {/* <Route path="/application/:id" element={<Dashboard />} /> */}
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/applications" element={<Applications/>} />
        <Route path="/apply/:jobId" element={<JobApplication/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/approved" element={<Approved/>} />


      </Routes>
    </Router>
    </>
  );
}

export default App;