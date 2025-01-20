import React, { useState } from "react";
import axios from "axios";
import "../css/Auth.css";
import { MdEmail } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Registration from "../assets/Flap.jpeg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Auth = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, loginData);
      if (response.data.success) {
        const name = response.data.data.name;
        Cookies.set("sessionEmail", loginData.email, {
          path: "/",
          secure: true,
          expires: 1,
        });
        Cookies.set("sessionName", name, {
          path: "/",
          secure: true,
          expires: 1,
        });
        navigate("/chats");
      }
    } catch (error) {
      alert("Invalid Credentials!!!")
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/api/register`, signupData);
      if (response.data.success) {
        const name = response.data.data.name;
        Cookies.set("sessionEmail", loginData.email, {
          path: "/",
          secure: true,
          expires: 1,
        });
        Cookies.set("sessionName", name, {
          path: "/",
          secure: true,
          expires: 1,
        });
        navigate("/chats");
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <input type="checkbox" id="flip" />
        <div className="cover">
          <div className="front">
            <img src={Registration} alt="" />
            <div className="text">
              <span className="text-1">
                Welcome <br /> To Visual Product Matcher
              </span>
              <span className="text-2">Let's get started</span>
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="form-content">
            <div className="login-form">
              <div className="title">Login</div>
              <form onSubmit={handleLogin}>
                <div className="input-boxes">
                  <div className="input-box">
                    <MdEmail className="icons" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      name="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span
                      className="icons"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="button input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="text sign-up-text">
                    Don't have an account?{" "}
                    <label htmlFor="flip">Sign up now</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="signup-form">
              <div className="title">Signup</div>
              <form onSubmit={handleSignup}>
                <div className="input-boxes">
                  <div className="input-box">
                    <IoMdContact className="icons" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <MdEmail className="icons" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      name="email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span
                      className="icons"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      name="password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span
                      className="icons"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="button input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="text sign-up-text">
                    Already have an account?{" "}
                    <label htmlFor="flip">Login now</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
