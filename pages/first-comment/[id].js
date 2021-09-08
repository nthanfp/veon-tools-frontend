import axios from 'axios';
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PlayCircle, StopCircle, FileText } from 'react-bootstrap-icons';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Modal,
} from 'react-bootstrap';

import { API_URL } from '../../utils/const';
import { WithAuth } from '../../contexts/WithAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar, Head, Menu } from '../../components';
import { AutoScrollingTextarea } from '../../components';

const FirstCommentDetail = (props) => {
  const { id } = props;
  const router = useRouter();

  const [data, setData] = useState({});
  const [logData, setLogData] = useState([]);
  const [describe, setDescribe] = useState({});
  const [target, setTarget] = useState([]);
  const [comment, setComment] = useState([]);
  const [instagram, setInstagram] = useState({});
  const [dataId, setDataId] = useState(id);
  const [update, setUpdate] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [showLogTxt, setShowLogTxt] = useState(false);

  const messagesEndRef = useRef(null);

  const AuthContext = useAuthContext();
  const myProfile = AuthContext.getUser();
  const token = AuthContext.getToken();

  const capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join('').toLowerCase();

  const handleCloseLog = () => setShowLog(false);

  const handleShowLog = () => {
    axios
      .get(`${API_URL}/log/file/firstcomment-${dataId}.stdout.log`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setUpdate('logtext');
        setShowLogTxt(res.data);
      })
      .catch((err) => {});
    setShowLog(true);
  };

  const handleStart = () => {
    axios
      .get(`${API_URL}/firstcomment/start/${dataId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setUpdate('start');
        Swal.fire({
          icon: 'success',
          title: 'Success...',
        });
      })
      .catch((err) => {
        if (err.response.data.message) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message,
          });
        }
      });
  };

  const handleStop = () => {
    axios
      .get(`${API_URL}/firstcomment/stop/${dataId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setUpdate('stop');
        Swal.fire({
          icon: 'success',
          title: 'Stopped...',
        });
      })
      .catch((err) => {
        if (err.response.data.message) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message,
          });
        }
      });
  };

  useEffect(() => {
    setUpdate('');
    axios
      .get(`${API_URL}/firstcomment/${dataId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTarget(res.data.data.target);
        setComment(res.data.data.comment);
        setInstagram(res.data.data.instagram_id);
      });
    axios
      .get(`${API_URL}/firstcomment/describe/${dataId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        const data = res.data.data[0];
        if (data === undefined) {
          setDescribe({
            status: 'stopped',
            name: '',
            pid: '',
            memory: '',
            cpu: '',
            pm2_env: '',
          });
        } else {
          if (data.pid != 0) {
            setDescribe({
              status: 'running',
              name: data.name,
              pid: data.pid,
              memory: data.monit.memory,
              cpu: data.monit.cpu,
              pm2_env: data.pm2_env,
            });
          } else {
            setDescribe({
              status: 'stopped',
              name: data.name,
              pid: data.pid,
              memory: data.monit.memory,
              cpu: data.monit.cpu,
              pm2_env: data.pm2_env,
            });
          }
        }
      });

    const dataLog = {
      type: 'FIRST_COMMENT',
      ref: dataId,
    };
    axios
      .post(`${API_URL}/log/find`, dataLog, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setLogData(res.data.data);
      });
  }, [update]);

  return (
    <>
      <Head title="First Comment Detail" />
      <Navbar />
      <Container className="mb-5">
        <Row className="justify-content-md-center">
          <Menu />
          <Col md lg="10" className="mt-4">
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>
                    <b>ID</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{id}</td>
                </tr>
                <tr>
                  <td>
                    <b>Action</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start mb-2">
                      <div className="px-2">
                        <Button variant="primary" onClick={handleShowLog}>
                          <FileText /> Logs
                        </Button>
                      </div>
                      {(() => {
                        if (describe.status === 'stopped') {
                          return (
                            <div className="px-2">
                              <Button
                                variant="success px-2"
                                onClick={handleStart}
                              >
                                <PlayCircle /> Run
                              </Button>
                            </div>
                          );
                        } else {
                          return (
                            <div className="px-2">
                              <Button
                                variant="danger px-2"
                                onClick={handleStop}
                              >
                                <StopCircle /> Stop
                              </Button>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </td>
                </tr>
                {(() => {
                  if (describe.status === 'running') {
                    return (
                      <tr>
                        <td>
                          <b>Server usage</b>
                        </td>
                        <td width="15">
                          <b>:</b>
                        </td>
                        <td>
                          <div>
                            <b>Memory :</b> {describe.memory}
                          </div>
                          <div>
                            <b>CPU :</b> {describe.cpu}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })()}
                <tr>
                  <td>
                    <b>Account</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>@{instagram.username}</td>
                </tr>
                <tr>
                  <td>
                    <b>Target</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>
                    {target.map((val, i) => {
                      return <div key={i}>{val}</div>;
                    })}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Comment</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>
                    {comment.map((val, i) => {
                      return <div key={i}>{val}</div>;
                    })}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Maximum Comment per Day</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{data.max_comment_per_day}</td>
                </tr>
                <tr>
                  <td>
                    <b>Comment Likes Quantity</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{data.comment_likes_quantity}</td>
                </tr>
              </tbody>
            </Table>
            <hr />
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Link</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {logData.length > 0
                  ? logData.map((log) => {
                      return (
                        <tr key={log._id}>
                          <td>
                            <span className="badge bg-success">
                              {capitalize(log.data.status)}
                            </span>
                          </td>
                          <td>{log.data.link}</td>
                          <td>{log.data.username}</td>
                        </tr>
                      );
                    })
                  : ''}

                {logData.length === 0 ? (
                  <tr>
                    <td colSpan="3">No data found</td>
                  </tr>
                ) : (
                  ''
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Modal show={showLog} onHide={handleCloseLog} size="lg">
        <Modal.Header>
          <Modal.Title>Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Target</Form.Label>
            <AutoScrollingTextarea
              className="form-control"
              as="textarea"
              rows={12}
              placeholder="Log list"
              value={showLogTxt}
              wrap="off"
              disabled
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLog}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseLog}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export async function getServerSideProps({ params, req, res }) {
  const { id } = params;

  return {
    props: {
      id,
    },
  };
}

export default WithAuth(FirstCommentDetail);
