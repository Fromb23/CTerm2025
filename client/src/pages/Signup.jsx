import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/themeContext.jsx";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Card from "../components/ui/Card";
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiSun,
  FiMoon,
  FiLoader,
} from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useToast } from "../contexts/toastContext";
import { signupUser } from "../redux/actions/signupActions.js";
import { signupState } from "../redux/slices/signupSlice";
import Loading from "../components/ui/Loading.jsx";

const Signup = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { loading, error, user } = useSelector((state) => state.signup);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    current_level: "",
    education_background: "",
    career_goals: "",
    skills: [],
    preferred_language: "",
    preferred_timezone: ""
  });

  // --- field configs ---
  const fields = [
    {
      name: "full_name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: <FiUser className="w-5 h-5 text-secondary" />,
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      icon: <FiMail className="w-5 h-5 text-secondary" />,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Create a password",
      icon: <FiLock className="w-5 h-5 text-secondary" />,
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-secondary hover:text-primary transition-colors duration-200"
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      ),
    },
    {
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      label: "Confirm Password",
      placeholder: "Re-enter your password",
      icon: <FiLock className="w-5 h-5 text-secondary" />,
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="text-secondary hover:text-primary transition-colors duration-200"
        >
          {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      ),
    },
  ];

  // --- toggle theme ---
  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // --- handle inputs ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // --- form validation ---
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (data.confirmPassword !== data.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (user) {
      addToast("Account created successfully!", "success");
      navigate("/login");
      dispatch(signupState());
    }
    if (error) {
      addToast(error || "Signup failed. Please try again.", "error");
      dispatch(signupState());
    }
  }, [user, error, dispatch, addToast]);

  // handle submit
  const handleSubmit = (formDataToSubmit) => {
    if (!validateForm(formDataToSubmit)) return;

    delete formDataToSubmit.confirmPassword;
    dispatch(signupUser(formDataToSubmit));
  };

  // --- OAuth Handlers ---
  const handleGoogleSignup = () => {
    console.log("Google signup flow triggered");
    // redirect to Google OAuth provider...
  };

  const handleGithubSignup = () => {
    console.log("GitHub signup flow triggered");
    // redirect to GitHub OAuth provider...
  };
  if (loading) return <Loading />;

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="bg-primary text-primary min-h-screen transition-colors duration-300">
        {/* Header */}
        <header className="bg-accent text-on-accent py-4 shadow-theme-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="border-on-accent text-on-accent"
              >
                <FiArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold">Create Account</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleDarkMode}
              className="border-on-accent text-on-accent"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
                <p className="text-secondary">Join us and start your learning journey</p>
              </div>

              {/* Form */}
              <Form
                onSubmit={handleSubmit}
                fields={fields}
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
              >
                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className={`w-full ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-105 transform"
                    } transition-all duration-200`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-secondary" />
                <span className="px-3 text-secondary text-sm">OR continue with</span>
                <hr className="flex-grow border-secondary" />
              </div>

              {/* Social OAuth */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleGoogleSignup}
                >
                  <FaGoogle className="w-5 h-5" />
                  Google
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleGithubSignup}
                >
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <span className="text-secondary">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-accent font-semibold hover:underline transition-all duration-200"
                >
                  Sign in
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;