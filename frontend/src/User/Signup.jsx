import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from '../config/appConfig';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../Assets/background.jpeg";
import SocialSignup from "./SocialSignup";
import "./SocialAuthStyles.css";
import { GoogleLogin } from "@react-oauth/google";

function Signup() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
  `${config.api_base_urls.user}/signup`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };

  // Social Signup handler for Google and Facebook
  const handleSocialSignup = async (userInfo, provider) => {
    try {
      let payload = {};
      if (provider === "google") {
        // userInfo is the Google credential response
        payload = {
          provider: "google",
          credential: userInfo.credential,
        };
      } /*else if (provider === "facebook") {
        // userInfo is the Facebook user info object
        payload = {
          provider: "facebook",
          email: userInfo.email,
          username: userInfo.username,
          providerId: userInfo.providerId,
        };
      }*/
      const { data } = await axios.post(
  `${config.api_base_urls.user}/social-signup`,
        payload,
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
      handleError("Social signup failed. Please try again.");
    }
  };

  return (
    /* <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">*/
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-3 rounded w-25">
        <h2>
          <center>Sign Up</center>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Username</strong>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={username}
              className="form-control rounded-1"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              name="email"
              value={email}
              className="form-control rounded-1"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your Password"
              name="password"
              value={password}
              className="form-control rounded-1"
              onChange={handleOnChange}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 rounded-1"
            style={{ backgroundColor: "rgb(13, 191, 66)", color: "white" }}
          >
            Sign Up
          </button>
        </form>
        <div className="separator" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
          <span style={{ margin: '0 10px', color: '#888' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
        </div>
        <div className="social-auth-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SocialSignup onSuccess={handleSocialSignup} googleButtonText="Sign Up with Google" fbButtonText="Sign Up with Facebook" />
        </div>
        <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <span style={{ marginRight: '8px' }}>Already have an account?</span>
          <Link
            to="/login"
            style={{ color: '#1976d2', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}
          >
            Log in
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
