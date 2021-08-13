import { Container, Row, Col } from 'react-bootstrap';

import { Navbar, Head } from '../components';

const Blog = () => {
  return (
    <div>
      <Head title="Blog" />
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mt-4" xs lg="10">
            <h2 className="text-center">Blog</h2>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
