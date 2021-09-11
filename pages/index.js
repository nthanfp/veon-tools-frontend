import { Container, Row, Col, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

import { API_URL } from '../utils/const';
import { WithAuth } from '../contexts/WithAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/state';
import { Navbar, Head, Menu } from '../components';

const Home = () => {
  const [dateState, setDateState] = useState(
    moment().format('YYYY-MM-DD HH:mm:ss')
  );
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({});

  const consumer = useAppContext();
  const AuthContext = useAuthContext();

  const myProfile = AuthContext.getUser();
  const token = AuthContext.getToken();

  useEffect(() => {
    setInterval(
      () => setDateState(moment().format('YYYY-MM-DD HH:mm:ss')),
      1000
    );
    axios
      .get(`${API_URL}/users/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setProfile(res.data.data.profile);
        setStats(res.data.data.stats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dateTime = moment().format('MM-DD-YYYY HH:mm:ss');

  return (
    <>
      <Head title="Home" />
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Menu />
          <Col className="mt-4" xs lg="10">
            <p>Welcome {myProfile.first_name}!</p>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>
                    <b>Server Time</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{dateState}</td>
                </tr>
                <tr>
                  <td>
                    <b>Total Instagram Accounts</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{stats.instagram} Accounts</td>
                </tr>
                <tr>
                  <td>
                    <b>Total First Comment Settings</b>
                  </td>
                  <td width="15">
                    <b>:</b>
                  </td>
                  <td>{stats.firstcomment} </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WithAuth(Home);
