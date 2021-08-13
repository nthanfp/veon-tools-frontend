import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Navbar as NavbarBs, Container, Nav } from 'react-bootstrap';

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, removeUserSession } = useAuthContext();
  const handleLogout = () => {
    alert('Logout!');
    removeUserSession();
    router.replace('/users/login');
  };

  return (
    <>
      <NavbarBs bg="primary" variant="dark" expand="lg">
        <Container>
          <NavbarBs.Brand href="#home">Veon Tools</NavbarBs.Brand>
          <NavbarBs.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBs.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/">
                <a className="nav-item nav-link">Home</a>
              </Link>
              <Link href="/blog">
                <a className="nav-item nav-link">Blog</a>
              </Link>
            </Nav>
            <Nav>
              {(() => {
                if (isLoggedIn()) {
                  return (
                    <Link href="#">
                      <a className="nav-item nav-link" onClick={handleLogout}>
                        Logout
                      </a>
                    </Link>
                  );
                } else {
                  return (
                    <Link href="/users/login">
                      <a className="nav-item nav-link">Login</a>
                    </Link>
                  );
                }
              })()}
            </Nav>
          </NavbarBs.Collapse>
        </Container>
      </NavbarBs>
    </>
  );
};

export default Navbar;
