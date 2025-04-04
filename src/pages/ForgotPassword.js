import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      toast.error("⚠️ Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with your actual endpoint
      await axios.post("http://localhost:5000/forgot-password", { email });
      
      setSuccess("Password reset link sent to your email");
      toast.success("📧 Password reset link sent!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
      toast.error("⚠️ Error sending reset link");
      console.error("Forgot Password Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <Logo>E-Commerce App</Logo>
          <h2>Reset Your Password</h2>
          <p>Enter your email to receive a reset link</p>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
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

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderWrapper>
                <span className="spinner"></span>
                <span>Sending...</span>
              </LoaderWrapper>
            ) : (
              "Send Reset Link"
            )}
          </SubmitButton>

          <AuthFooter>
            Remember your password? <AuthLink to="/login">Login</AuthLink>
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

// Reuse your existing styled components and add new ones
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

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 13px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 13px;
  padding: 8px 12px;
  background-color: #d4edda;
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

export default ForgotPassword;