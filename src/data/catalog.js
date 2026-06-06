import bydCatalog from "./BYD.json";
import geelyCatalog from "./GEELY.json";
import gatesCatalog from "./GATES.json";

const catalogs = [bydCatalog, geelyCatalog, gatesCatalog];

export const catalogItems = catalogs.flatMap((catalog) =>
  Array.isArray(catalog.items) ? catalog.items : []
);

export const catalogMetadata = {
  description: "Catálogo consolidado de repuestos BYD, Geely y Gates sin precios.",
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
  if (product.make && String(product.make).trim()) {
    return String(product.make).trim();
  }

  return (
    product.generic_brand ||
    product.source_brand ||
    product.eom_brand ||
    "Marca sin definir"
  );
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

export function getDetailFields(product = {}) {
  const labels = {
    id: "ID",
    make: "Marca del vehículo",
    model: "Modelo",
    source_catalog: "Catálogo fuente",
    item_number: "Item",
    oem: "OEM",
    part_number: "Part number",
    eom_brand: "Marca OEM",
    generic_brand: "Marca genérica",
    source_brand: "Marca fuente",
    category: "Categoría",
    category_es: "Categoría (ES)",
    subcategory: "Subcategoría",
    subcategory_es: "Subcategoría (ES)",
    description: "Descripción",
    product_name_en: "Nombre (EN)",
    product_name_es: "Nombre (ES)",
    technical_name_es: "Nombre técnico",
    variant: "Variante",
    engine: "Motor",
    engine_code: "Código de motor",
    compatible_years: "Años compat.",
    vehicle_years_text: "Años compat. (texto)",
    page: "Página",
  };

  return Object.entries(product)
    .filter(([key, value]) => {
      if (key === "image") return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return value !== null && value !== undefined && value !== "";
    })
    .map(([key, value]) => ({
      key,
      label: labels[key] || key,
      value:
        key === "compatible_years" && Array.isArray(value)
          ? value.join(", ")
          : value,
    }))
    .filter(({ key }) => key !== "id" || product.id);
}

export function getSearchableText(product = {}) {
  return [
    product.id,
    product.make,
    product.model,
    product.source_catalog,
    product.category,
    product.category_es,
    product.subcategory,
    product.subcategory_es,
    product.product_name_en,
    product.product_name_es,
    product.technical_name_es,
    product.description,
    product.variant,
    product.engine,
    product.engine_code,
    product.oem,
    product.part_number,
    product.item_number,
    getBrand(product),
    getYearText(product),
  ]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join(" ")
    .toLowerCase();
}

export function findCatalogItem(id = "") {
  return catalogItems.find((item) => item.id === id);
}
