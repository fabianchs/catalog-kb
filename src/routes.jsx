import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useRouteError,
} from "react-router-dom";
import { Layout } from "./pages/Layout";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Single = lazy(() => import("./pages/Single").then((module) => ({ default: module.Single })));

const pageLoader = (
  <div className="container py-5">
    <div className="text-muted">Cargando catálogo...</div>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={pageLoader}>
    <Component />
  </Suspense>
);

const RouteError = () => {
  const error = useRouteError();
  const message = error?.message || error?.statusText || "No se pudo cargar esta página.";

  return (
    <div className="container py-5">
      <h1 className="display-6">No se pudo cargar el catálogo</h1>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<RouteError />}>
      <Route index element={withSuspense(Home)} />
      <Route path="single/:theId" element={withSuspense(Single)} />
    </Route>
  )
);
