import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { Eye, EyeOff } from "react-feather";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      toast.error("⚠️ Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("🔒 Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("🔒 Password too short");
      setIsLoading(false);
      return;
    }

    try {
      // Check if user exists
      const { data: users } = await axios.get("http://localhost:5000/users");
      if (users.some(user => user.email === formData.email)) {
        setError("Email already registered");
        toast.error("📧 Email already in use");
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer", // Default role
        createdAt: new Date().toISOString()
      };

      await axios.post("http://localhost:5000/users", newUser);
      
      toast.success("🎉 Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError("Registration failed. Please try again.");
      toast.error("⚠️ Registration failed");
      console.error("Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <Logo>E-Commerce App</Logo>
          <h2>Create Your Account</h2>
          <p>Join us to start shopping</p>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInputWrapper>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordInputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderWrapper>
                <span className="spinner"></span>
                <span>Creating account...</span>
              </LoaderWrapper>
            ) : (
              "Sign Up"
            )}
          </SubmitButton>

          <AuthFooter>
            Already have an account? <AuthLink to="/login">Log in</AuthLink>
          </AuthFooter>
        </AuthForm>
      </AuthCard>

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        toastStyle={{
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />
    </AuthContainer>
  );
};


// Styled Components
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 440px;
  padding: 40px;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h2 {
    color: #333;
    font-size: 24px;
    font-weight: 600;
    margin: 16px 0 8px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4f46e5;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 13px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 14px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AuthFooter = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 16px;
`;

const AuthLink = styled(Link)`
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;