import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  catalogItems,
  catalogMetadata,
  getBrand,
  getCategory,
  getDisplayName,
  getPrimaryCode,
  getSearchableText,
  getSubcategory,
  getYearOptions,
  normalizeText,
} from "../data/catalog";

export const Home = () => {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [selectedEngineCode, setSelectedEngineCode] = useState("");
  const products = catalogItems;

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
    () => [...new Set(products.map((item) => getCategory(item)).filter(Boolean))],
    [products]
  );

  const subcategories = useMemo(
    () =>
      [
        ...new Set(
          products
            .filter((item) => (selectedBrand ? getBrand(item) === selectedBrand : true))
            .filter((item) => (selectedModel ? item.model === selectedModel : true))
            .filter((item) => (selectedCategory ? getCategory(item) === selectedCategory : true))
            .map((item) => getSubcategory(item))
            .filter(Boolean)
        ),
      ],
    [products, selectedBrand, selectedModel, selectedCategory]
  );

  const brands = useMemo(
    () => [...new Set(products.map((item) => getBrand(item)).filter(Boolean))],
    [products]
  );

  const engines = useMemo(() => {
    const filteredProducts = products
      .filter((item) => (selectedBrand ? getBrand(item) === selectedBrand : true))
      .filter((item) => (selectedModel ? item.model === selectedModel : true));

    return [...new Set(filteredProducts.map((item) => item.engine).filter(Boolean))].sort();
  }, [products, selectedBrand, selectedModel]);

  const engineCodes = useMemo(() => {
    const filteredProducts = products
      .filter((item) => (selectedBrand ? getBrand(item) === selectedBrand : true))
      .filter((item) => (selectedModel ? item.model === selectedModel : true))
      .filter((item) => (selectedEngine ? item.engine === selectedEngine : true));

    return [...new Set(filteredProducts.map((item) => item.engine_code).filter(Boolean))].sort();
  }, [products, selectedBrand, selectedModel, selectedEngine]);

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

  useEffect(() => {
    if (selectedEngine && !engines.includes(selectedEngine)) {
      setSelectedEngine("");
    }
  }, [engines, selectedEngine]);

  useEffect(() => {
    if (selectedEngineCode && !engineCodes.includes(selectedEngineCode)) {
      setSelectedEngineCode("");
    }
  }, [engineCodes, selectedEngineCode]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return products.filter((product) => {
      const brandValue = getBrand(product);
      const yearOptions = getYearOptions(product);
      const matchesQuery = normalizedQuery
        ? getSearchableText(product).includes(normalizedQuery)
        : true;

      const matchesModel = selectedModel ? product.model === selectedModel : true;
      const matchesCategory = selectedCategory ? getCategory(product) === selectedCategory : true;
      const matchesSubcategory = selectedSubcategory
        ? getSubcategory(product) === selectedSubcategory
        : true;
      const matchesBrand = selectedBrand ? brandValue === selectedBrand : true;
      const matchesYear = selectedYear ? yearOptions.includes(selectedYear) : true;
      const matchesEngine = selectedEngine ? product.engine === selectedEngine : true;
      const matchesEngineCode = selectedEngineCode
        ? product.engine_code === selectedEngineCode
        : true;

      return (
        matchesQuery &&
        matchesModel &&
        matchesCategory &&
        matchesSubcategory &&
        matchesBrand &&
        matchesYear &&
        matchesEngine &&
        matchesEngineCode
      );
    });
  }, [products, query, selectedModel, selectedCategory, selectedSubcategory, selectedBrand, selectedYear, selectedEngine, selectedEngineCode]);

  return (
    <main className="catalog-page">
      <section className="hero-section py-5 text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="eyebrow">Catálogo multimarca</span>
              <h1 className="display-5 fw-bold mt-3">
                Catálogo de repuestos Kolber Autoparts
              </h1>
              <p className="lead text-white-75 mt-3">
                Busca piezas BYD, Geely y Gates por marca, modelo, motor, código, año, categoría o OEM/part number.
              </p>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="hero-panel p-4 shadow-sm rounded-4 bg-white text-dark">
                <div className="hero-panel-body">
                  <h4 className="mb-3">Kolber Autoparts</h4>
                  <p className="mb-4 text-muted">
                    {catalogMetadata.total_items || products.length} piezas disponibles para{" "}
                    {brands.length} marcas, {models.length} modelos y {categories.length} categorías.
                  </p>
                  <div className="hero-stat-grid">
                    <div className="hero-stat-box">
                      <strong>{products.length}</strong>
                      <span>partes</span>
                    </div>
                    <div className="hero-stat-box">
                      <strong>{brands.length}</strong>
                      <span>marcas</span>
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
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, motor, OEM, part number, marca, modelo, año o categoría"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Marca</label>
              <select
                value={selectedBrand}
                onChange={(event) => setSelectedBrand(event.target.value)}
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
                onChange={(event) => setSelectedModel(event.target.value)}
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
                onChange={(event) => setSelectedYear(event.target.value)}
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
                onChange={(event) => setSelectedCategory(event.target.value)}
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
              <label className="form-label text-muted">Motor</label>
              <select
                value={selectedEngine}
                onChange={(event) => {
                  setSelectedEngine(event.target.value);
                  setSelectedEngineCode("");
                }}
                className="form-select form-select-lg"
              >
                <option value="">Todos los motores</option>
                {engines.map((engine) => (
                  <option key={engine} value={engine}>
                    {engine}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Engine code</label>
              <select
                value={selectedEngineCode}
                onChange={(event) => setSelectedEngineCode(event.target.value)}
                className="form-select form-select-lg"
                disabled={selectedEngine && engineCodes.length === 0}
              >
                <option value="">Todos los codes</option>
                {engineCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Subcategoría</label>
              <select
                value={selectedSubcategory}
                onChange={(event) => setSelectedSubcategory(event.target.value)}
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
                  <th scope="col">Código</th>
                  <th scope="col">Subcategoría</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{getDisplayName(product)}</strong>
                        <div className="text-muted small">{product.description}</div>
                      </td>
                      <td>{product.model}</td>
                      <td>{getBrand(product)}</td>
                      <td>{getCategory(product)}</td>
                      <td>{getPrimaryCode(product)}</td>
                      <td>{getSubcategory(product)}</td>
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
