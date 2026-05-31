import { Link, useParams } from "react-router-dom";
import {
  findCatalogItem,
  getBrand,
  getCategory,
  getDisplayName,
  getPrimaryCode,
  getSubcategory,
  getYearText,
} from "../data/catalog";

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 640'%3E%3Crect width='960' height='640' fill='%23f4f7f4'/%3E%3Ccircle cx='480' cy='260' r='94' fill='%238cc63f'/%3E%3Ctext x='480' y='294' text-anchor='middle' font-family='Arial,sans-serif' font-size='96' font-weight='700' fill='white'%3EK%3C/text%3E%3Ctext x='480' y='410' text-anchor='middle' font-family='Arial,sans-serif' font-size='42' font-weight='700' fill='%23143556'%3EKolber Autoparts%3C/text%3E%3Ctext x='480' y='466' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' fill='%235f6c7b'%3ECat%C3%A1logo multimarca%3C/text%3E%3C/svg%3E";

const brandImages = {
  BYD: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/BYD_Company%2C_Ltd._-_Logo.svg/960px-BYD_Company%2C_Ltd._-_Logo.svg.png",
  Geely: "https://vanreviewer.co.uk/wp-content/uploads/2025/03/Geely-Auto-logo.webp",
};

export const Single = () => {
  const { theId } = useParams();
  const product = findCatalogItem(theId);

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
              style={{
                backgroundImage: `url(${product.image || brandImages[getBrand(product)] || placeholderImage})`,
              }}
            />
          </div>
          <div className="col-lg-6">
            <span className="eyebrow text-success">{getCategory(product)}</span>
            <h1 className="mt-3">{getDisplayName(product)}</h1>
            <p className="lead text-muted">{product.description}</p>
            <div className="mb-4">
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                {product.model}
              </span>
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                {getSubcategory(product)}
              </span>
              <span className="badge bg-success bg-opacity-15 text-success me-2 mb-2">
                Código: {getPrimaryCode(product)}
              </span>
            </div>
            <div className="table-responsive mb-4">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Marca</th>
                    <td>{getBrand(product)}</td>
                  </tr>
                  <tr>
                    <th>Modelo</th>
                    <td>{product.model || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Años compat.</th>
                    <td>{getYearText(product) || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>OEM</th>
                    <td>{product.oem || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Part number</th>
                    <td>{product.part_number || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Catálogo fuente</th>
                    <td>{product.source_catalog || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Item</th>
                    <td>{product.item_number || "N/A"}</td>
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
