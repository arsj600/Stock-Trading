import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { loginSuccess } from "../state/authSlice";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_API_BASE;

export const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [phoneno, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [currentState, setCurrentState] = useState("Login");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (currentState === "Sign Up") {
        response = await axios.post(`${backendUrl}api/user/register`, {
          name,
          dob,
          personalId,
          phoneno,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}api/user/login`, {
          email,
          password,
        });
      }

      console.log("Login/Signup response:", response.data);

      if (response.data.success) {
        const { user, token } = response.data;

        if (!user || !token) {
          toast.error("Login failed: user or token missing");
          return;
        }

      
        dispatch(loginSuccess({ user, token }));

        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Login" ? null : (
        <div className="flex flex-col gap-4 w-full">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
          <input
            onChange={(e) => setDob(e.target.value)}
            value={dob}
            type="date"
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <input
            onChange={(e) => setPersonalId(e.target.value)}
            value={personalId}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="PersonalId"
            required
          />
          <input
            onChange={(e) => setPhoneNo(e.target.value)}
            value={phoneno}
            type="number"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Phone Number"
            required
          />
        </div>
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
            Create Account
          </p>
        ) : (
          <p onClick={() => setCurrentState("Login")} className="cursor-pointer">
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};
