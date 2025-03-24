import { Link } from "react-router-dom";
// src/components/AuthLayout.js
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import logo from "./logo.svg";
const AuthLayout = ({ isSignin }) => {


  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5} xl={4} style={{ maxWidth: "400px" }}>
          <div
            className="border p-4 rounded"
            style={{ backgroundColor: "black", color: "white" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "50px", marginRight: "10px" }}
              />
              <h3 style={{ margin: "0" }}>Practice with Ai</h3>
            </div>
            <h2 className="text-center mb-4">
              {isSignin ? "Sign In" : "Sign Up"}
            </h2>
            <Form>
              {isSignin ? (
                <>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Sign In
                  </Button>
                  <p style={{ textAlign: "center" }}>
                    Don't have an Account? <Link to="/sign-up">Sign-up</Link>
                  </p>
                </>
              ) : (
                <>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Sign Up
                  </Button>
                  <p style={{ textAlign: "center" }}>
                    Already have an Account? <Link to="/sign-in">Sign-in</Link>
                  </p>
                </>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLayout;
