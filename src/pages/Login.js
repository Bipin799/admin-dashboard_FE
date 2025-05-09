import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Eye, EyeOff, Loader } from "react-feather";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser?.role) { 
      switch (loggedInUser.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "client":
          navigate("/client-dashboard");
          break;
        case "customer":
          navigate("/customer-dashboard");
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      toast.error("⚠️ Email and password cannot be empty!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data || [];

      if (users.length === 0) {
        setError("No user found. Please register first.");
        toast.error("No user found. Please register first.");
        setIsLoading(false);
        return;
      }

      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!matchedUser) {
        setError("Invalid email or password. Please try again.");
        toast.error("❌ Incorrect email or password!");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
      localStorage.setItem("role", matchedUser.role);

      toast.success("🎉 Login Successful!");

      setTimeout(() => {
        switch (matchedUser.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "client":
            navigate("/client-dashboard");
            break;
          case "customer":
            navigate("/customer-dashboard");
            break;
          default:
            navigate("/login");
        }
      }, 1000);
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      toast.error("⚠️ Error fetching users. Please try again later.");
      console.error("Login Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <Logo> E-Commerce App </Logo>
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInputWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* <PasswordToggle 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle> */}

              <PasswordToggle 
                  type="button"  // Add this to prevent form submission
                  onClick={(e) => {
                    e.preventDefault();  // Prevent default behavior
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>

            </PasswordInputWrapper>
          </FormGroup>

          <ForgotPasswordLink to="/forgot-password">
            Forgot password?
          </ForgotPasswordLink>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderWrapper>
                <Loader size={20} className="spin" />
                <span>Signing in...</span>
              </LoaderWrapper>
            ) : (
              "Sign In"
            )}
          </SubmitButton>

          <SignUpText>
            Don't have an account? <SignUpLink to="/register">Sign up</SignUpLink>
          </SignUpText>
        </LoginForm>
      </LoginCard>

      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        hideProgressBar={false}
        toastStyle={{
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />
    </LoginContainer>
  );
};

export default Login;

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 440px;
  padding: 40px;
`;

const LoginHeader = styled.div`
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

const LoginForm = styled.form`
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


const ForgotPasswordLink = styled(Link)`
  font-size: 13px;
  color: #4f46e5;
  text-align: right;
  text-decoration: none;
  margin-top: -8px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 13px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-top: -8px;
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

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SignUpText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 16px;
`;

const SignUpLink = styled(Link)`
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;