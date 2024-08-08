import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Kero Recibo</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavBar;