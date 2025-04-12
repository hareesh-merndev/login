import { useState } from "react";
import "./LoginRegister.css";

export const LoginRegister = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  return (
    <div className="login-register-container">
      <div className="form-container">
        {isLogin ? (
          <>
            <h2>Login</h2>
            <label>
              Email:
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                fetch("/api/login", {
                  method: "POST",
                  body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((response) => {
                    if (response.status !== 200) {
                      throw new Error("Login Failed!");
                    }

                    return response.json().then((data) => setUser(data));
                  })
                  .catch((error) => {
                    console.error("Login failed:", error);
                    alert("Login failed.");
                  });
              }}
            >
              Login
            </button>
            <p>
              Don't have an account?{" "}
              <span
                className="toggle-link"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Register</h2>
            <label>
              Name:
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                fetch("/api/register", {
                  method: "POST",
                  body: JSON.stringify({
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((response) => {
                    if (response.status !== 200) {
                      throw new Error("Registration failed");
                    }

                    alert("Registration successful!");

                    setRegisterName("");
                    setRegisterEmail("");
                    setRegisterPassword("");
                  })
                  .catch((error) => {
                    console.error("Registration failed:", error);
                    alert("Registration failed.");
                  });
              }}
            >
              Register
            </button>
            <p>
              Already have an account?{" "}
              <span
                className="toggle-link"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};