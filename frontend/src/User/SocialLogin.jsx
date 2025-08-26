import React, { useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./SocialAuthStyles.css";

function SocialLogin({ onSuccess, googleButtonText = "Login with Google" }) {
  // Load Facebook SDK
  /*useEffect(() => {
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "YOUR_FB_APP_ID", // <-- Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: "v19.0",
        });
      };
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, "script", "facebook-jssdk"));
    }
  }, []);*/

  // Facebook login handler
  /*const handleFacebookLogin = () => {
    window.FB.login(function (response) {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email,picture' }, function (userInfo) {
          // Send userInfo to backend /social-login
          onSuccess && onSuccess({
            email: userInfo.email,
            username: userInfo.name,
            provider: "facebook",
            providerId: userInfo.id,
            picture: userInfo.picture?.data?.url,
          }, "facebook");
        });
      }
    }, { scope: 'email,public_profile' });
  };*/

  const handleGoogleSuccess = (credentialResponse) => {
    onSuccess && onSuccess(credentialResponse, "google");
  };

  const googleBtnRef = useRef(null);

  const handleCustomGoogleLogin = () => {
    if (googleBtnRef.current) {
      googleBtnRef.current.querySelector('div[role="button"]')?.click();
    }
  };

  return (
    <div className="social-login-buttons">
      {/* Hidden official GoogleLogin button */}
      <div ref={googleBtnRef} style={{ display: "none" }}>
        <GoogleLogin
          text={googleButtonText}
          onSuccess={handleGoogleSuccess}
        />
      </div>
      {/* Custom Google button for UI consistency */}
      <button
        type="button"
        className="social-btn google"
        style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: '10px' }}
        onClick={handleCustomGoogleLogin}
      >
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C36.16 2.36 30.4 0 24 0 14.82 0 6.73 5.48 2.69 13.44l8.06 6.27C12.36 13.13 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.16 5.36-4.6 7.02l7.18 5.59C43.98 37.36 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.75 28.71c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.64 16.36 0 20.07 0 24c0 3.93.64 7.64 2.69 11.09l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.4 0 12.16-2.36 16.14-6.43l-7.18-5.59c-2.01 1.35-4.59 2.13-7.46 2.13-6.27 0-11.64-3.63-14.25-8.91l-8.06 6.27C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
        </span>
        {googleButtonText}
      </button>
      {/*<button
        type="button"
        className="social-btn facebook"
        style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}
        onClick={handleFacebookLogin}
      >
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#4267B2"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.771c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.733-.592-1.326-1.325-1.326z"/></svg>
        </span>
        Login with Facebook
      </button>*/}
    </div>
  );
}

export default SocialLogin;
