import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { Trash } from 'react-bootstrap-icons';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Table,
  Badge,
} from 'react-bootstrap';

import { API_URL } from '../../utils/const';
import { WithAuth } from '../../contexts/WithAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar, Head, Menu } from '../../components';

const Home = () => {
  const [isLoading, setLoading] = useState(false);
  const [listAccounts, setListAccounts] = useState([]);
  const [update, setUpdate] = useState('');

  const router = useRouter();
  const AuthContext = useAuthContext();
  const myProfile = AuthContext.getUser();
  const token = AuthContext.getToken();

  const initialValues = {
    username: '',
    password: '',
  };

  //prettier-ignore
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Minimum 3 characters')
      .required('Required!'),
    password: Yup.string()
      .min(5, 'Minimum 5 characters')
      .required('Required!'),
  });

  const onSubmit = (values, actions) => {
    const data = JSON.stringify(values);
    axios
      .post(`${API_URL}/instagram/add`, data, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setUpdate('added');
        const msg = res.data.message;
        Swal.fire({
          icon: 'success',
          title: 'Success...',
        });
      })
      .catch(function (error) {
        if (error.response) {
          const msg = error.response.data.message;
          if (msg === 'username not found') {
            actions.setFieldError('username', msg);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: msg,
            });
          }
        } else {
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

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/instagram/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          })
          .then((res) => {
            Swal.fire('Deleted!', 'Account has been deleted.', 'success');
            setUpdate('deleted');
          })
          .catch((err) => {
            Swal.fire('Error!', err.message, 'error');
          });
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/instagram`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setLoading(false);
        setUpdate('');
        setListAccounts(res.data.data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [update]);

  return (
    <>
      <Head title="Add Instagram" />
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Menu />
          <Col className="mt-4" lg="5">
            <Card border="primary">
              <Card.Header className="bg-primary text-white">
                Login Instagram
              </Card.Header>
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
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Instagram username"
                              name="username"
                              value={formik.values.username}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.username}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Instagram password"
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
                              {formik.isSubmitting ? 'Loading...' : 'Login'}
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
          <Col className="mt-4" lg="5">
            <h4 className="text-center">My Accounts</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : (
                  listAccounts.map((ig, i) => {
                    i++;
                    return (
                      <tr key={ig._id}>
                        <td>{i}</td>
                        <td>{ig.username}</td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                handleDelete(ig._id);
                              }}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WithAuth(Home);
