import React, { useState } from "react";
import {Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styled from "styled-components";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      toast.error("⚠️ Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("⚠️ Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/reset-password",
        {
          userId,
          token,
          newPassword: password
        }
      );
      
      setSuccess(response.data.message || "Password reset successfully");
      toast.success("✅ Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         "Error resetting password. Please try again.";
      setError(errorMessage);
      toast.error(`⚠️ ${errorMessage}`);
      console.error("Reset Password Error:", error);
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
          <p>Enter your new password below</p>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderWrapper>
                <span className="spinner"></span>
                <span>Resetting...</span>
              </LoaderWrapper>
            ) : (
              "Reset Password"
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

// Reuse the same styled components from ForgotPassword.js
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

export default ResetPassword;