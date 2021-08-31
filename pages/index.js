import { Container, Row, Col } from 'react-bootstrap';

import { WithAuth } from '../contexts/WithAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/state';
import { Navbar, Head, Menu } from '../components';

const Home = () => {
  const consumer = useAppContext();
  const AuthContext = useAuthContext();

  const myProfile = AuthContext.getUser();
  return (
    <>
      <Head title="Home" />
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Menu />
          <Col className="mt-4" xs lg="10">
            <p>Welcome {myProfile.first_name}!</p>
            <p>{console.log(process.env)}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WithAuth(Home);
