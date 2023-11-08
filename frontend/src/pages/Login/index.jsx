// Import necessary dependencies and components
import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./style.css";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/restify-logo.png"
import * as Icon from 'react-bootstrap-icons';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  let refresh_token = Cookies.get("Refresh");
  let access_token = Cookies.get("Access");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    let validationErrors = {};
    if (!username) {
      validationErrors.username = "Username is required"
    } else {
      validationErrors.username = "";
    }

    if (!password) {
      validationErrors.password = "Password is required"
    } else {
      validationErrors.password = "";
    }


    if (!Object.values(validationErrors).every(x => x == "")) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await login(username, password);
      console.log(response)
      Cookies.set("Access", response.data.access);
      Cookies.set("Refresh", response.data.refresh);

      if (response.status === 200) {
        setSuccess(true);
        navigate('/');
        window.location.reload();
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#411B21" }}>
      <Container className="container">
        <Row className="row1">
          <Col className="col1">
            <div className="card1">
              <div className="card-row">
                <div className="card-row-col1">
                  <img className="card-row-col1-img1" src="https://images.adsttc.com/media/images/5a8c/3430/f197/cc42/b800/004b/medium_jpg/HIPWF_ShanghaiTower_ZhonghaiShen_141101_040.jpg?1519137830" />
                </div>
                <div className="card-row-col2">
                  <div className="card-body">
                    <Form onSubmit={handleSubmit} className="auth-form">
                      <div className="form-img-div">
                        <span className="form-img-span"><img src={logo} width="50%" alt="" /></span>
                      </div>
                      <h5>Sign into your account</h5>
                      {error && (
                        <Alert variant="danger">
                          Username or password incorrect
                        </Alert>
                      )}

                      {success && (
                        <Alert variant="success">Logged in successfully</Alert>
                      )}

                      <Form.Group className="mb-4" controlId="username">
                        <div className="d-flex align-items-center">

                          <Icon.EnvelopeFill />
                          <Form.Control
                            type="username"
                            placeholder="Username Address"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          /></div>
                        {errors.username && (
                          <div className="text-danger text-start">{errors.username}</div>
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
                      <div className="button-div">
                        <button type="submit">
                          Login
                        </button>
                      </div>
                      <a className="small" href="#!">Forgot password?</a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Don't have an account? <a href="/register" style={{ color: "#393f81" }}>Register here</a></p>
                      <a href="#" className="small">Terms of use.</a>
                      <a href="#" className="small">Privacy policy</a>
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

export default Login;
