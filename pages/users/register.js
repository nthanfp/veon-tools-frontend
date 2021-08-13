import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';

import { API_URL } from '../../utils/const';
import { WithoutAuth } from '../../contexts/WithAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar, Head } from '../../components';

const Login = () => {
  const router = useRouter();
  const AuthContext = useAuthContext();
  const token = AuthContext.getToken();

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  };

  //prettier-ignore
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .min(2, 'Minimum 2 characters')
      .required('Required!'),
    last_name: Yup.string()
      .min(2, 'Minimum 2 characters')
      .required('Required!'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Required!'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Required!'),
  });

  const onSubmit = (values, actions) => {
    const data = JSON.stringify(values);
    axios
      .post(`${API_URL}/users/register`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        const msg = res.data.message;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Redirecting to home page...',
        });
      })
      .catch(function (error) {
        setError(true);
        if (error.response) {
          const msg = error.response.data.message;
          if (msg === 'Email has been registered!') {
            setFieldError('email', msg);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: msg,
            });
          } else {
            setMsg(msg);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: msg,
            });
          }
        } else {
          setMsg(error.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
          });
        }
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  return (
    <div>
      <Head title="Login" />
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mt-5" xs lg="6">
            <Card border="primary">
              <Card.Header className="bg-primary text-white">Login</Card.Header>
              <Card.Body>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form onSubmit={formik.handleSubmit}>
                          <Form.Group className="mb-3">
                            <Row>
                              <Col>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="First name"
                                  name="first_name"
                                  value={formik.values.first_name}
                                  onChange={formik.handleChange}
                                  isInvalid={!!formik.errors.first_name}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.first_name}
                                </Form.Control.Feedback>
                              </Col>
                              <Col>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Last name"
                                  name="last_name"
                                  value={formik.values.last_name}
                                  onChange={formik.handleChange}
                                  isInvalid={!!formik.errors.last_name}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.last_name}
                                </Form.Control.Feedback>
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter email"
                              name="email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Password"
                              name="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.password}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="d-grid gap-2 mt-2">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={formik.isSubmitting}
                            >
                              {formik.isSubmitting ? 'Loading...' : 'Register'}
                            </Button>
                          </div>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WithoutAuth(Login);
