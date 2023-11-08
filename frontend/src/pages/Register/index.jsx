import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/restify-logo.png"

const SignUp = () => {
  // Initialize state
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { sign_up } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
    const emailRegex = /^(?!.*(\.\.)|.*(@\.)|.*(\.@)|.*(@$))[\w!#$%&'*+\-/=?^`{|}~%]+(?:\.[\w!#$%&'*+\-/=?^`{|}~%]+)*@(?!.*(\.\.)|.*(_)|.*(-[^\w])|.*(\.[^\w]))(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    const validationErrors = {};

    if (!usernameRegex.test(username)) {
      validationErrors.username = "Username is invalid";
    }

    if (!emailRegex.test(email)) {
      validationErrors.email = "Email is invalid.";
    }

    if (!passwordRegex.test(password)) {
      validationErrors.password = "Password is invalid";
    }

    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords don't match";
    }

    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await sign_up(username, firstName, lastName, email, password, confirmPassword);
      console.log(response)

      if (response.status === 200) {
        setBackendError(false);
        navigate("/");
        window.location.reload();
      } else {
        setBackendError(true);
      }
    } catch (error) {
      setBackendError(true);
      console.log(error)
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "rgb(58, 11, 84)" }}>
      <Container className="container">
        <Row className="row1">
          <Col className="col1">
            <div className="card1">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-7 align-items-center d-block mx-auto mx-md-0 img-fluid" style={{ marginTop: "150px" }}>
                  <img className="mx-auto d-block" src={logo} width="40%" alt="Restify" style={{ marginLeft: "150px", marginBottom: "25px" }} />
                  <img src="https://www.pngkey.com/png/full/204-2041980_landscape-euclidean-night-sky-lights-bright-transprent-cartoon.png" className="img-fluid" />
                </div>
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <div className="card-body">
                    <Form onSubmit={handleSubmit} className="auth-form">
                      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Sign Up</h1>
                      {success && (
                        <Alert variant="success">Account created successfully</Alert>
                      )}
                      {backendError && (
                        <Alert variant="danger">
                          Something went wrong please try again
                        </Alert>
                      )}

                      <Form.Group className="mb-4" controlId="username">
                        <div className="d-flex align-items-center">
                          <Icon.PersonFill />
                          <Form.Control
                            type="text"
                            placeholder="UserName"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>

                        {errors.username && (
                          <div className="text-danger text-start">{errors.username}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="firstName">
                        <div className="d-flex align-items-center">

                          <Icon.Pencil />
                          <Form.Control
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        {errors.firstName && (
                          <div className="text-danger text-start">{errors.firstName}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="lastName">
                        <div className="d-flex align-items-center">
                          <Icon.Pencil />
                          <Form.Control
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        {errors.lastName && (
                          <div className="text-danger text-start">{errors.lastName}</div>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-4" controlId="email">
                        <div className="d-flex align-items-center">
                          <Icon.EnvelopeFill />
                          <Form.Control
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        {errors.lastName && (
                          <div className="text-danger text-start">{errors.email}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="password">
                        <div className="d-flex align-items-center">

                          <Icon.LockFill />
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          /></div>
                        {errors.password && (
                          <div className="text-danger text-start">{errors.password}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="confirmPassword">
                        <div className="d-flex align-items-center">
                          <Icon.KeyFill />
                          <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          /></div>
                        {errors.confirmPassword && (
                          <div className="text-danger text-start">{errors.confirmPassword}</div>
                        )}
                      </Form.Group>
                      <p className="mb-5 pb-lg-2" style={{ color: "black" }}>Already have an account? <a href="/login"
                        style={{ color: "#0d6efd" }}>Login here</a></p>
                      <div className="form-check mb-5">
                        <input className="form-check-input me-2" type="checkbox" value="" id="form5" required />
                        I agree all statements in <a href="#!">Terms of service</a>
                      </div>

                      <div className="button-div">
                        <button type="submit">
                          Sign Up
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SignUp;
