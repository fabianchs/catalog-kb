import bydCatalog from "./BYD.json";
import geelyCatalog from "./GEELY.json";

const catalogs = [bydCatalog, geelyCatalog];

export const catalogItems = catalogs.flatMap((catalog) =>
  Array.isArray(catalog.items) ? catalog.items : []
);

export const catalogMetadata = {
  description: "Catálogo consolidado de repuestos BYD y Geely sin precios.",
  price_fields_removed: catalogs.every((catalog) => catalog.metadata?.price_fields_removed),
  total_items: catalogItems.length,
  models: [...new Set(catalogItems.map((item) => item.model).filter(Boolean))].sort(),
  brands: [...new Set(catalogItems.map((item) => getBrand(item)).filter(Boolean))].sort(),
  sources: catalogs.map((catalog) => catalog.metadata).filter(Boolean),
};

export function normalizeText(text = "") {
  return String(text).trim().toLowerCase();
}

export function getBrand(product = {}) {
  return product.generic_brand || product.source_brand || product.eom_brand || "Marca sin definir";
}

export function getDisplayName(product = {}) {
  return (
    product.technical_name_es ||
    product.product_name_es ||
    product.product_name_en ||
    product.description ||
    "Producto sin nombre"
  );
}

export function getCategory(product = {}) {
  return product.category_es || product.category || "Sin categoría";
}

export function getSubcategory(product = {}) {
  return product.subcategory_es || product.subcategory || "Sin subcategoría";
}

export function getYearText(product = {}) {
  if (product.vehicle_years_text) return product.vehicle_years_text;
  if (Array.isArray(product.compatible_years) && product.compatible_years.length) {
    return product.compatible_years.join(", ");
  }
  return "";
}

export function getYearOptions(product = {}) {
  if (Array.isArray(product.compatible_years) && product.compatible_years.length) {
    return product.compatible_years.map(String);
  }
  const fallback = getYearText(product);
  return fallback ? [fallback] : [];
}

export function getPrimaryCode(product = {}) {
  if (product.oem) return product.oem;
  if (product.part_number) return product.part_number;
  if (product.item_number) return `Item ${product.item_number}`;
  return product.id || "N/A";
}

export function findCatalogItem(id = "") {
  return catalogItems.find((item) => item.id === id);
}
