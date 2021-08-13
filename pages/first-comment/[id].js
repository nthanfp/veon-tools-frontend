import axios from 'axios';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
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
} from 'react-bootstrap';

import { API_URL } from '../../utils/const';
import { WithAuth } from '../../contexts/WithAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar, Head, Menu } from '../../components';

const FirstCommentDetail = (props) => {
  const { id } = props;
  const router = useRouter();

  const [level, setLevel] = useState({
    level1: {
      level2: {
        level3: 'OK!',
      },
    },
  });
  const [data, setData] = useState({});
  const [describe, setDescribe] = useState({});
  const [server, setServer] = useState({});
  const [target, setTarget] = useState([]);
  const [comment, setComment] = useState([]);
  const [instagram, setInstagram] = useState({});
  const [dataId, setDataId] = useState(id);
  const [update, setUpdate] = useState('');

  const AuthContext = useAuthContext();
  const myProfile = AuthContext.getUser();
  const token = AuthContext.getToken();

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
          console.log('Undefined data');
          setDescribe({
            status: 'stopped',
            name: '',
            pid: '',
            memory: '',
            cpu: '',
            pm2_env: '',
          });
        } else {
          console.log(data);
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
  }, [update]);

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

  console.log(describe);

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
                    <b>Id</b>
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
                        <Button variant="primary">
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
          </Col>
        </Row>
      </Container>
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
