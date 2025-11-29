import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the hash fragment for access token
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Fetch user info from Google
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          // Send user info to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "GOOGLE_AUTH_SUCCESS",
                user: {
                  googleId: userInfo.id,
                  email: userInfo.email,
                  firstName: userInfo.given_name,
                  lastName: userInfo.family_name,
                  profilePicture: userInfo.picture,
                },
              },
              window.location.origin
            );
            window.close();
          } else {
            // If not in popup, redirect to auth page
            navigate("/auth");
          }
        })
        .catch((err) => {
          console.error("Error fetching Google user info:", err);
          if (window.opener) {
            window.close();
          } else {
            navigate("/auth");
          }
        });
    } else {
      // No access token, redirect to auth
      if (window.opener) {
        window.close();
      } else {
        navigate("/auth");
      }
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="spinner"
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #000",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <p>Đang xử lý đăng nhập Google...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
