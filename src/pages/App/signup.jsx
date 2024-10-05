import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  GlobeEuropeAfricaIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  EyeSlashIcon,
  KeyIcon,
  EyeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Signup = () => {
  // context import
  const { user, login, setLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [user, navigate]);

  const currentYEAR = new Date().getFullYear(); // Get's Cureent Year

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("--Select Country--");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("--Select Gender--");

  // Field status state
  const [firstNameStatus, setFirstNameStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastNameStatus, setLastNameStatus] = useState(false);
  const [middleNameStatus, setMiddleNameStatus] = useState(false);
  const [dateOfBirthStatus, setDateOfBirthStatus] = useState(false);
  const [genderStatus, setGenderStatus] = useState(false);
  const [countryStatus, setCountryStatus] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);

  const [formPhase, setFormPhase] = useState(0);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

  function setFormReadyToNext() {
    setFormPhase((prev) => prev + 1);
    setNextButtonDisabled(true);
  }

  const getCurrentPhaseText = () => {
    switch (formPhase) {
      case 0:
        return "Let us get to know you ";
      case 1:
        return "We want to recognize you";
      case 2:
        return "How old are you ? ";
      case 3:
        return "We need to recognize you";
      case 4:
        return "Confirm it's you ";
    }
  };

  useEffect(() => {
    if (formPhase == 0 && checkInputFilledPhase0()) {
      setNextButtonDisabled(false);
    } else if (formPhase == 1 && checkInputFilledPhase1()) {
      setNextButtonDisabled(false);
    } else if (formPhase == 2 && !checkInputFilledPhase2()) {
      setNextButtonDisabled(false);
    } else if (formPhase == 3 && checkInputFilledPhase3()) {
      setNextButtonDisabled(false);
    } else if (formPhase == 4 && checkInputFilledPhase4()) {
      setNextButtonDisabled(false);
    }
  }, [
    email,
    password,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    country,
    gender,
    confirmPassword,
  ]);

  useEffect(() => {
    if (formPhase == 4 && checkInputFilledPhase4()) {
      setNextButtonDisabled(false);
    }
  }, [confirmPassword]);

  const submitForm = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          email,
          profile_img: "/vite.svg",
          gender,
          country,
          dob: dateOfBirth,
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
    }
    setLoading(false);
  };

  // Check if user age is less five or below
  const getUserInputAgeSatus = (dob) => {
    const year = new Date(dob).getFullYear();
    let status = false;
    if (currentYEAR - year < 6) {
      // User is young.
      status = true;
    }
    return status;
  };

  const checkInputFilledPhase0 = () => {
    let status = false;
    if (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      middleName.trim() !== ""
    ) {
      status = true;
    }
    return status;
  };
  const checkInputFilledPhase1 = () => {
    let status = false;
    if (gender !== "--Select Gender--" && country !== "--Select Country--") {
      status = true;
    }
    return status;
  };
  const checkInputFilledPhase2 = () => {
    getUserInputAgeSatus(dateOfBirth);
  };

  const checkInputFilledPhase3 = () => {
    let status = false;
    if (email.trim() !== "" && password.trim() !== "") {
      status = true;
    }
    return status;
  };
  const checkInputFilledPhase4 = () => {
    let status = false;
    if (password === confirmPassword) {
      status = true;
    }
    return status;
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (formPhase == 0 && checkInputFilledPhase0()) {
      setFormReadyToNext();
    } else {
      setNextButtonDisabled(false);
    }
    if (formPhase == 1 && checkInputFilledPhase1()) {
      setFormReadyToNext();
    } else {
      setNextButtonDisabled(false);
    }
    if (formPhase == 2 && !checkInputFilledPhase2()) {
      setFormReadyToNext();
    } else {
      setNextButtonDisabled(false);
    }
    if (formPhase == 3 && checkInputFilledPhase3()) {
      setFormReadyToNext();
    } else {
      setNextButtonDisabled(false);
    }
    if (formPhase == 4 && checkInputFilledPhase4()) {
      submitForm();
    }
    setNextButtonDisabled(true);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    setFormPhase((prev) => prev - 1);
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
            <h2 className="text-center text-4xl font-bold">
              {getCurrentPhaseText()}
            </h2>
            <form
              name="signup_form"
              id="signup_form"
              className="w-full grid gap-6 md:w-2/4 mx-auto"
            >
              <div className="grid ">
                <div className={`${formPhase == 0 ? "grid gap-5" : "hidden"}`}>
                  <div className="grid gap-2">
                    <div className="form-styles">
                      <UserIcon className="w-6 h-6" />
                      <input
                        className="w-full"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {
                          {
                            e.target.value.trim() == ""
                              ? setFirstNameStatus(true)
                              : setFirstNameStatus(false);
                          }
                          setFirstName(e.target.value);
                        }}
                      />
                    </div>
                    {firstNameStatus && (
                      <p className="text-sm text-red-400">
                        Provide a first name
                      </p>
                    )}
                  </div>
                  <div className="grid-gap-2">
                    <div className="form-styles">
                      <IdentificationIcon className="w-6 h-6" />
                      <input
                        className="w-full"
                        type="text"
                        placeholder="Middle Name"
                        value={middleName}
                        onChange={(e) => {
                          {
                            e.target.value.trim() == ""
                              ? setMiddleNameStatus(true)
                              : setMiddleNameStatus(false);
                          }
                          setMiddleName(e.target.value);
                        }}
                      />
                    </div>
                    {middleNameStatus && (
                      <p className="text-sm text-red-400">
                        Provide a middle name
                      </p>
                    )}
                  </div>
                  <div className="grid-gap-2">
                    <div className="form-styles">
                      <UserGroupIcon className="w-6 h-6" />
                      <input
                        className="w-full"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {
                          {
                            e.target.value.trim() == ""
                              ? setLastNameStatus(true)
                              : setLastNameStatus(false);
                          }
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                    {lastNameStatus && (
                      <p className="text-sm text-red-400">
                        Porvide a last name
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${formPhase == 1 ? "grid gap-5" : "hidden"}`}>
                  <div className="grid gap-2">
                    <div className="form-styles">
                      <UsersIcon className="w-6 h-6" />
                      <select
                        name=""
                        id=""
                        placeholder="--Select Gender--"
                        className="select w-full"
                        value={gender}
                        onChange={(e) => {
                          e.target.value == "--Select Gender--"
                            ? setGenderStatus(true)
                            : setGenderStatus(false);
                          setGender(e.target.value);
                        }}
                      >
                        <option value="--Select Gender--">
                          --Select Gender--
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {genderStatus && (
                      <p className="text-sm text-red-400">Select your Gender</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="form-styles">
                      <GlobeEuropeAfricaIcon className="w-6 h-6" />
                      <select
                        name=""
                        id="#dede"
                        value={country}
                        onChange={(e) => {
                          e.target.value == "--Select Country--"
                            ? setCountryStatus(true)
                            : setCountryStatus(false);
                          setCountry(e.target.value);
                        }}
                        className="select w-full"
                      >
                        <option value="--Select Country--">
                          --Select Country--
                        </option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Chad">Chad</option>
                      </select>
                    </div>
                    {countryStatus && (
                      <p className="text-sm text-red-400">
                        Select your country!
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${formPhase == 2 ? "grid gap-5" : "hidden"}`}>
                  <div className="grid-gap-2">
                    <div className="form-styles">
                      <CalendarIcon className="w-6 h-6" />
                      <input
                        className="w-full"
                        type="date"
                        placeholder="Last Name"
                        value={dateOfBirth}
                        onChange={(e) => {
                          getUserInputAgeSatus(dateOfBirth)
                            ? setDateOfBirthStatus(true)
                            : setDateOfBirthStatus(false);
                          setDateOfBirth(e.target.value);
                        }}
                      />
                    </div>
                    {dateOfBirthStatus && (
                      <p className="text-sm text-red-400">
                        You are too young!!
                      </p>
                    )}
                  </div>
                </div>

                <div className={`${formPhase == 3 ? "grid gap-5" : "hidden"}`}>
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
                <div className={`${formPhase == 4 ? "grid gap-5" : "hidden"}`}>
                  <div className="grid gap-2">
                    <div className="form-styles">
                      <KeyIcon className="w-6 h-6" />
                      <input
                        className="w-full"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          e.target.value.trim() !== password
                            ? setConfirmPasswordStatus(true)
                            : setConfirmPasswordStatus(false);
                          setConfirmPassword(e.target.value);
                        }}
                      />
                      <div
                        className="cursor-pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="w-6 h-6" />
                        ) : (
                          <EyeSlashIcon className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                    {confirmPasswordStatus && (
                      <p className="text-sm text-red-400">
                        Passwords don't match
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-5 py-5 items-center ml-auto w-full">
                {formPhase > 0 && (
                  <Button onClick={handlePrevClick}>Previous</Button>
                )}
                <Button disabled={nextButtonDisabled} onClick={handleNextClick}>
                  {formPhase == 4 ? "Done" : "Next"}
                </Button>
              </div>
              <Link
                to="/login"
                className="text-center hover:underline text-slate-300"
              >
                Already have account ?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
