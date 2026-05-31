import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import bydCatalog from "../data/BYD.json";

function normalizeText(text = "") {
  return String(text).trim().toLowerCase();
}

function getBrand(product = {}) {
  return product.generic_brand || product.source_brand || product.eom_brand || "BYD";
}

function getYearText(product = {}) {
  if (product.vehicle_years_text) return product.vehicle_years_text;
  if (Array.isArray(product.compatible_years) && product.compatible_years.length) {
    return product.compatible_years.join(", ");
  }
  return (
    product.year ||
    product.model_year ||
    product.anio ||
    product.año ||
    product.year_from ||
    product.year_to ||
    parseModelYear(product.model) ||
    ""
  );
}

function getYearOptions(product = {}) {
  if (Array.isArray(product.compatible_years) && product.compatible_years.length) {
    return product.compatible_years.map(String);
  }
  const fallback = getYearText(product);
  return fallback ? [fallback] : [];
}

function parseModelYear(model = "") {
  const text = String(model);
  const fourDigit = text.match(/\b(19|20)\d{2}\b/);
  if (fourDigit) return fourDigit[0];
  const twoDigit = text.match(/\b\d{2}\b/);
  return twoDigit ? twoDigit[0] : "";
}

export const Home = () => {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const products = bydCatalog.items || [];

  const models = useMemo(() => {
    const filteredProducts = selectedBrand
      ? products.filter((item) => getBrand(item) === selectedBrand)
      : products;
    return [...new Set(filteredProducts.map((item) => item.model).filter(Boolean))];
  }, [products, selectedBrand]);
  const years = useMemo(() => {
    const filteredProducts = products
      .filter((item) => (selectedBrand ? getBrand(item) === selectedBrand : true))
      .filter((item) => (selectedModel ? item.model === selectedModel : true));

    const allYears = filteredProducts.flatMap((item) => getYearOptions(item));
    return [...new Set(allYears.filter(Boolean))].sort((a, b) => Number(a) - Number(b));
  }, [products, selectedBrand, selectedModel]);
  const categories = useMemo(
    () => [...new Set(products.map((item) => item.category_es || item.category).filter(Boolean))],
    [products]
  );
  const subcategories = useMemo(
    () =>
      [...new Set(
        products
          .filter((item) => (selectedBrand ? getBrand(item) === selectedBrand : true))
          .filter((item) => (selectedModel ? item.model === selectedModel : true))
          .filter((item) => {
            if (!selectedCategory) return true;
            return (item.category_es || item.category) === selectedCategory;
          })
          .map((item) => item.subcategory_es || item.subcategory)
          .filter(Boolean)
      )],
    [products, selectedBrand, selectedModel, selectedCategory]
  );
  const brands = useMemo(
    () => [...new Set(products.map((item) => getBrand(item)).filter(Boolean))],
    [products]
  );

  useEffect(() => {
    if (selectedModel && !models.includes(selectedModel)) {
      setSelectedModel("");
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (selectedYear && !years.includes(selectedYear)) {
      setSelectedYear("");
    }
  }, [years, selectedYear]);

  useEffect(() => {
    if (selectedSubcategory && !subcategories.includes(selectedSubcategory)) {
      setSelectedSubcategory("");
    }
  }, [subcategories, selectedSubcategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return products.filter((product) => {
      const brandValue = getBrand(product);
      const yearText = getYearText(product);
      const yearOptions = getYearOptions(product);
      const matchesQuery = normalizedQuery
        ? [
            product.id,
            product.model,
            product.category,
            product.category_es,
            product.subcategory,
            product.subcategory_es,
            product.product_name_en,
            product.product_name_es,
            product.description,
            product.oem,
            product.part_number,
            brandValue,
            yearText,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesModel = selectedModel ? product.model === selectedModel : true;
      const categoryValue = product.category_es || product.category;
      const subcategoryValue = product.subcategory_es || product.subcategory;
      const matchesCategory = selectedCategory ? categoryValue === selectedCategory : true;
      const matchesSubcategory = selectedSubcategory ? subcategoryValue === selectedSubcategory : true;
      const matchesBrand = selectedBrand ? brandValue === selectedBrand : true;
      const matchesYear = selectedYear ? yearOptions.includes(selectedYear) : true;

      return matchesQuery && matchesModel && matchesCategory && matchesSubcategory && matchesBrand && matchesYear;
    });
  }, [products, query, selectedModel, selectedCategory, selectedBrand, selectedYear]);

  return (
    <main className="catalog-page">
      <section className="hero-section py-5 text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="eyebrow">Catálogo Multibrand</span>
              <h1 className="display-5 fw-bold mt-3">
                Catalogo de Kolber Autoparts
              </h1>
              <p className="lead text-white-75 mt-3">
                Busca piezas de carro con filtros de modelo y categoría, y navega.
              </p>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="hero-panel p-4 shadow-sm rounded-4 bg-white text-dark">
                <div className="hero-panel-body">
                  <h4 className="mb-3">Kolber Autoparts</h4>
                  <p className="mb-4 text-muted">
                    {products.length} Piezas disponibles para {models.length} modelos en {categories.length} categorías.
                  </p>
                  <div className="hero-stat-grid">
                    <div className="hero-stat-box">
                      <strong>{products.length}</strong>
                      <span>partes</span>
                    </div>
                    <div className="hero-stat-box">
                      <strong>{models.length}</strong>
                      <span>modelos</span>
                    </div>
                    <div className="hero-stat-box">
                      <strong>{categories.length}</strong>
                      <span>categorías</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-filters py-4 bg-light">
        <div className="container">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label text-muted">Buscar</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, OEM, categoría, marca, modelo, año o subcategoría"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-select form-select-lg"
              >
                <option value="">Todas las marcas</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="form-select form-select-lg"
                disabled={selectedBrand && models.length === 0}
              >
                <option value="">Todos los modelos</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Año</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="form-select form-select-lg"
              >
                <option value="">Todos los años</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select form-select-lg"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Subcategoría</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="form-select form-select-lg"
                disabled={selectedCategory && subcategories.length === 0}
              >
                <option value="">Todas las subcategorías</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-table-section py-5">
        <div className="container">
          <div className="table-responsive shadow-sm rounded-4 overflow-hidden bg-white">
            <table className="table parts-table mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Parte</th>
                  <th scope="col">Modelo</th>
                  <th scope="col">Marca</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">OEM</th>
                  <th scope="col">Subcategoría</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.product_name_es || product.product_name_en}</strong>
                        <div className="text-muted small">{product.description}</div>
                      </td>
                      <td>{product.model}</td>
                      <td>{getBrand(product)}</td>
                      <td>{product.category_es || product.category}</td>
                      <td>{product.oem}</td>
                      <td>{product.subcategory_es || product.subcategory}</td>
                      <td>
                        <Link
                          to={`/single/${encodeURIComponent(product.id)}`}
                          className="btn btn-sm btn-outline-success"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      No se encontraron resultados para la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}; 