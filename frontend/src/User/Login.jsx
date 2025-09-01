import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from '../config/appConfig';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../Assets/background.jpeg";
import SocialLogin from "./SocialLogin";
import "./SocialAuthStyles.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = inputValue;
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
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
  `${config.api_base_urls.user}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        console.log("Success message triggered");
        handleSuccess(message);
        // Immediately fetch user info and set context
        try {
          const { data: verifyData } = await axios.post(
            `${config.api_base_urls.user}/verify-cookie`,
            {},
            { withCredentials: true }
          );
          if (verifyData.status) {
            login(verifyData.user);
          }
        } catch (error) {
          console.log("Error verifying cookie:", error);
        }
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
    });
  };

  // Social Login handler for Google and Facebook
  const handleSocialLogin = async (userInfo, provider) => {
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
  `${config.api_base_urls.user}/social-login`,
        payload,
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success && provider === "google") {
        handleSuccess(message);
        // Immediately fetch user info and set context
        const { data: verifyData } = await axios.post(
          `${config.api_base_urls.user}/verify-cookie`,
          {},
          { withCredentials: true }
        );
        if (verifyData.status) {
          login(verifyData.user);
        }
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
      handleError("Social login failed. Please try again.");
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
          <center>Login</center>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              //autoComplete='off'
              name="email"
              value={email}
              className="form-control rounded-0"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                name="password"
                value={password}
                className="form-control rounded-0 pe-5"
                onChange={handleOnChange}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-0 h-100 border-0 bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                style={{ right: "10px", zIndex: "10" }}
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.88 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="text-end mt-1">
              <span style={{ fontSize: "0.875rem", color: "#1976d2", cursor: "pointer" }}>
                Forgot Password?
              </span>
            </div>
          </div>
          {/*  <button type="submit" className="btn btn-success w-100 rounded-1">*/}
          <button
            type="submit"
            className="btn w-100 rounded-1"
            style={{ backgroundColor: "rgb(13, 191, 66)", color: "white" }}
          >
            Login
          </button>
          <div className="separator" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
            <span style={{ margin: '0 10px', color: '#888' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
          </div>
          <div className="social-auth-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SocialLogin onSuccess={handleSocialLogin} googleButtonText="Login with Google" fbButtonText="Sign Up with Facebook" />
          </div>
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <span style={{ marginRight: '8px' }}>Don't have an account?</span>
            <Link
              to="/signup"
              style={{ color: '#1976d2', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
