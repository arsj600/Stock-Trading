import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../state/authSlice";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector((state) => state.auth.user);
  const reduxToken = useSelector((state) => state.auth.token);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      const user = reduxUser || JSON.parse(localStorage.getItem("user"));
      const token = reduxToken || localStorage.getItem("token");

      if (!user || !token) {
        navigate("/login");
      }
    }
  }, [ready, reduxUser, reduxToken, navigate]);

  const user = reduxUser || JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

      <div className="space-y-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{user.name}</p>
        </div>

        <div>
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>

        <div>
          <p className="font-semibold">Date of Birth:</p>
          <p>{user.dob}</p>
        </div>

        <div>
          <p className="font-semibold">Personal ID:</p>
          <p>{user.personalId}</p>
        </div>

        <div>
          <p className="font-semibold">Phone Number:</p>
          <p>{user.phoneno}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-8 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};
