import { Link, useParams } from "react-router-dom";
import bydCatalog from "../data/BYD.json";

const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/BYD_Company%2C_Ltd._-_Logo.svg/960px-BYD_Company%2C_Ltd._-_Logo.svg.png";

export const Single = () => {
  const { theId } = useParams();
  const products = bydCatalog.items || [];
  const product = products.find((item) => item.id === theId);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-6">Producto no encontrado</h1>
        <p className="text-muted">El producto solicitado no existe en este catálogo.</p>
        <Link to="/" className="btn btn-brand">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <section className="product-detail py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div
              className="detail-media rounded-4"
              style={{ backgroundImage: `url(${product.image || placeholderImage})` }}
            />
          </div>
          <div className="col-lg-6">
            <span className="eyebrow text-success">{product.category_es || product.category}</span>
            <h1 className="mt-3">{product.product_name_es || product.product_name_en}</h1>
            <p className="lead text-muted">{product.description}</p>
            <div className="mb-4">
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                {product.model}
              </span>
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                {product.subcategory_es || product.subcategory}
              </span>
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                OEM: {product.oem}
              </span>
            </div>
            <div className="table-responsive mb-4">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Marca</th>
                    <td>{product.eom_brand || "BYD"}</td>
                  </tr>
                  <tr>
                    <th>Modelo</th>
                    <td>{product.model || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Años compat.</th>
                    <td>{product.vehicle_years_text || (Array.isArray(product.compatible_years) ? product.compatible_years.join(", ") : "N/A")}</td>
                  </tr>
                  <tr>
                    <th>Número EOM</th>
                    <td>{product.oem || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Part number</th>
                    <td>{product.part_number || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/" className="btn btn-outline-secondary btn-lg">
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
