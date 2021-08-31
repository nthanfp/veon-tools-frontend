import { Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Menu = () => {
  let router = useRouter();

  const handleChange = (event) => {
    let path = event.target.value;
    if (path) {
      router.replace(path);
    } else {
      alert('Please choose a menu!');
    }
  };

  return (
    <div>
      <Row className="mt-4 justify-content-center">
        <Col className="align-self-center" md lg="10">
          <div className="form-group">
            <label className="form-label">Choose Menu : </label>
            <select
              className="form-select"
              id="menu-select"
              onChange={handleChange}
            >
              <option value="">-- Choose Menu --</option>
              <option value="/">Home</option>
              <option value="/instagram">Instagram Account</option>
              <option value="/first-comment">First Comment</option>
            </select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Menu;
