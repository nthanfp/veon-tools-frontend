import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Trash } from 'react-bootstrap-icons';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
} from 'react-bootstrap';

import { API_URL } from '../../utils/const';
import { WithAuth } from '../../contexts/WithAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar, Head, Menu } from '../../components';

const FirstComment = () => {
  const [listAccounts, setListAccounts] = useState([]);
  const [listSetting, setListSetting] = useState([]);
  const [update, setUpdate] = useState('');

  const router = useRouter();
  const AuthContext = useAuthContext();
  const myProfile = AuthContext.getUser();
  const token = AuthContext.getToken();

  const initialValues = {
    instagram_id: '',
    target: '',
    comment: '',
    blacklist_word: '',
    run_speed: '',
    max_comment_per_day: '',
    comment_likes_quantity: '',
  };

  //prettier-ignore
  const validationSchema = Yup.object({
    instagram_id: Yup.string().
      required('Required!'),
    target: Yup.string()
      .min(5, 'Minimum 5 characters')
      .required('Required!'),
    comment: Yup.string()
      .min(5, 'Minimum 5 characters')
      .required('Required!'),
    blacklist_word: Yup.string()
      .min(5, 'Minimum 5 characters'),
    run_speed: Yup.number()
      .min(60, 'Minimum 60 seconds')
      .required('Required!'),
    max_comment_per_day: Yup.number()
      .max(15, 'Maximum 15 comments per day')
      .required('Required!'),
    comment_likes_quantity: Yup.number()
      .min(10, 'Minimum 10 likes')
      .max(100, 'Maximum 100 likes')
      .required('Required!'),
  });

  const onSubmit = (values, actions) => {
    const data = JSON.stringify(values);
    axios
      .post(`${API_URL}/firstcomment`, data, {
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
          .delete(`${API_URL}/firstcomment/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          })
          .then((res) => {
            Swal.fire('Deleted!', 'First comment has been deleted.', 'success');
            setUpdate('deleted');
          })
          .catch((err) => {
            Swal.fire('Error!', err.message, 'error');
          });
      }
    });
  };

  const handleDescribe = async (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/firstcomment/describe/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        .then((res) => {
          const data = res.data.data[0];
          if (data === undefined) {
            resolve({ status: 'stopped' });
          } else {
            if (data.pid != 0) {
              resolve({ status: 'running' });
            } else {
              resolve({ status: 'stopped' });
            }
          }
        })
        .catch((e) => {
          reject(e);
        });
    });

  const handleListSetting = async (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/firstcomment`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((e) => {
          reject(e);
        });
    });

  useEffect(() => {
    const user_id = myProfile.id;

    async function fetchRepoInfos() {
      // load repository details for this array of repo URLs
      const settings = await handleListSetting();

      // map through the repo list
      const promises = settings.map(async (setting) => {
        // request details from GitHub’s API with Axios
        // const response = await axios({
        //   method: 'GET',
        //   url: `${API_URL}/firstcomment/describe/${setting._id}`,
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'x-access-token': token,
        //   },
        // });
        const describe = await handleDescribe(setting._id);

        return { describe, ...setting };
      });

      // wait until all promises resolve
      const results = await Promise.all(promises);
      setListSetting(results);

      console.log(results);
    }

    fetchRepoInfos();

    // (async () => {
    //   const settings = await handleListSetting();

    //   const unresolved = settings.map(async (setting, idx) => {
    //     // let describe = await handleDescribe(setting._id);
    //     let response = await axios.get(
    //       `${API_URL}/firstcomment/describe/${setting._id}`,
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'x-access-token': token,
    //         },
    //       }
    //     );
    //     let data = { describe: response.data.data[0], ...setting };
    //     return data;
    //   });

    //   const resolved = await Promise.all(unresolved);
    //   setListSetting(resolved);
    // })();
  }, [update]);

  useEffect(() => {
    axios
      .get(`${API_URL}/instagram`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setListAccounts(res.data.data);
      });
  }, []);

  console.log(listSetting);

  return (
    <>
      <Head title="Add Instagram" />
      <Navbar />
      <Container className="mb-5">
        <Row className="justify-content-md-center">
          <Menu />
          <Col className="mt-4" lg="5">
            <Card border="primary">
              <Card.Header className="bg-primary text-white">
                Add First Comment Setting
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
                            <Form.Label>Choose Instagram Account</Form.Label>
                            <select
                              className="form-select"
                              name="instagram_id"
                              value={formik.values.instagram_id}
                              onChange={formik.handleChange}
                            >
                              <option value="">-- Choose Account --</option>
                              {listAccounts.map((ig) => {
                                return (
                                  <option key={ig._id} value={ig._id}>
                                    @{ig.username}
                                  </option>
                                );
                              })}
                            </select>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.instagram_id}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Target</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="target"
                              placeholder="Target list"
                              value={formik.values.target}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.target}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.target}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Comments list"
                              name="comment"
                              value={formik.values.comment}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.comment}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.comment}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Blacklist Word</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Blacklist word"
                              name="blacklist_word"
                              value={formik.values.blacklist_word}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.blacklist_word}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.blacklist_word}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Run Speed</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Run speed (seconds)"
                              name="run_speed"
                              value={formik.values.run_speed}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.run_speed}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.run_speed}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Max Comments per Day</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Max comments per day"
                              name="max_comment_per_day"
                              value={formik.values.max_comment_per_day}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.max_comment_per_day}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.max_comment_per_day}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Comment Likes Quantity</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Max comments per day"
                              name="comment_likes_quantity"
                              value={formik.values.comment_likes_quantity}
                              onChange={formik.handleChange}
                              isInvalid={!!formik.errors.comment_likes_quantity}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.comment_likes_quantity}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="d-grid gap-2 mt-2">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={formik.isSubmitting}
                            >
                              {formik.isSubmitting
                                ? 'Loading...'
                                : 'Add First Comment Setting'}
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
            <h4 className="text-center">My Settings</h4>
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
                {listSetting.map((set, i) => {
                  i++;
                  return (
                    <tr key={set._id}>
                      <td>{i}</td>
                      <td>{set.instagram_id.username}</td>
                      <td>{set.describe.status}</td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <Link href={`/first-comment/${set._id}`}>
                            <a>
                              <Button variant="primary" size="sm">
                                Detail
                              </Button>
                            </a>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              handleDelete(set._id);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WithAuth(FirstComment);
