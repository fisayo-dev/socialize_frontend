import { useEffect, useState } from "react";
import {
  EnvelopeIcon,
  EyeSlashIcon,
  KeyIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const { user, setLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);

  useEffect(() => {
    if (email.trim() == "" || password.trim() == "") {
      setLoginBtnDisabled(true);
    } else {
      setLoginBtnDisabled(false);
    }
  }, [email, password]);

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (data.token) {
        login(data.token);
      } else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          text: data.message,
          icon: "error",
          timer: 3500,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        text: "Unable to connect to database",
        icon: "error",
        timer: 3500,
        timerProgressBar: true,
      });
      // How are you doing today
    }
    setLoading(false);
  };
  return (
    <div className="app-container">
      <Link
        to="/"
        className="py-10 items-center justify-center text-center flex"
      >
        <h1 className="text-1xl font-bold">Socialize</h1>
      </Link>
      <div className="w-full mx-auto">
        <div className="grid py-5">
          <div className="grid gap-10 ">
            <h2 className="text-center text-4xl font-bold">Welcome Back!!</h2>
            <form
              name="signup_form"
              id="signup_form"
              className="w-full grid gap-6 md:w-2/4 mx-auto"
            >
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <div className="form-styles">
                    <EnvelopeIcon className="w-6 h-6" />
                    <input
                      className="w-full"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        e.target.value.trim() == ""
                          ? setEmailStatus(true)
                          : setEmailStatus(false);

                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  {emailStatus && (
                    <p className="text-sm text-red-400">Provide your email</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="form-styles">
                    <KeyIcon className="w-6 h-6" />
                    <input
                      className="w-full"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        e.target.value.trim() == ""
                          ? setPasswordStatus(true)
                          : setPasswordStatus(false);

                        setPassword(e.target.value);
                      }}
                    />
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="w-6 h-6" />
                      ) : (
                        <EyeSlashIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {passwordStatus && (
                    <p className="text-sm text-red-400">
                      Password cannot be empty
                    </p>
                  )}
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-5 py-5 items-center ml-auto w-full">
                <Button disabled={loginBtnDisabled} onClick={handleLoginClick}>
                  Login
                </Button>
              </div>
              <Link
                to="/signup"
                className="text-center hover:underline text-slate-300"
              >
                New to Socialize ?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
