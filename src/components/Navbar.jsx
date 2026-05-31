import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="site-navbar py-3">
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        <Link to="/" className="brand d-flex align-items-center text-decoration-none">
          <div className="brand-mark">K</div>
          <div>
            <div className="brand-name">Kolber Auto</div>
            <small className="text-muted">Catálogo</small>
          </div>
        </Link>

        <div className="nav-links d-flex flex-wrap gap-3 align-items-center">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/demo" className="nav-link">
            Demo
          </Link>
          <Link to="/single/1" className="nav-link">
            Producto
          </Link>
        </div>
      </div>
    </nav>
  );
};