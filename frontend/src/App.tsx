import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import PageLayout from "@/components/layout/PageLayout";
import { AppProvider } from "@/context/AppContext";

import theme from "@/utils/muiTheme";
import HomeLayout from "./components/layout/HomeLayout";
import TypographyLayout from "./components/layout/TypographyLayout";
import PageNotFound from "@/pages/PageNotFound";

const Home = lazy(() => import("@/pages/Home"));
const School = lazy(() => import("@/pages/School"));
const SchoolPage = lazy(() => import("@/pages/SchoolPage"));
const Sensors = lazy(() => import("@/pages/workspace/Sensors"));
const Integrations = lazy(() => import("@/pages/workspace/Integrations"));
const Pages = lazy(() => import("@/pages/workspace/Pages"));
const SchoolHome = lazy(() => import("@/pages/workspace/SchoolHome"));
const SchoolSettings = lazy(() => import("@/pages/workspace/SchoolSettings"));
const WidgetExamples = lazy(() => import("@/pages/WidgetExamples"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));

const queryClient = new QueryClient();

const App = () => {
  const [t] = useTranslation();
  return (
    <HelmetProvider>
      <Helmet>
        <meta name="description" content={t("meta.description")} />
      </Helmet>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
        <StyledEngineProvider injectFirst>
          <AppProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <Suspense
                  fallback={
                    <div>
                      <LinearProgress className="m-10" />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<HomeLayout />}>
                      <Route index element={<Home />} />
                    </Route>
                    <Route path="/" element={<TypographyLayout />}>
                      <Route
                        path="privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                    </Route>
                    <Route path=":schoolId" element={<PageLayout />}>
                      <Route index element={<School />} />
                      <Route
                        path="page/:pageId/sections/:sectionId"
                        element={<SchoolPage />}
                      />
                      <Route path="*" element={<PageNotFound />} />
                    </Route>
                    <Route path="widget-examples">
                      <Route index element={<WidgetExamples />} />
                    </Route>
                    <Route
                      path=":schoolId/workspace"
                      element={<WorkspaceLayout />}
                    >
                      <Route index element={<Navigate to="school" replace />} />
                      <Route path="school" element={<SchoolHome />} />
                      <Route path="pages" element={<Pages />} />
                      <Route path="sensors" element={<Sensors />} />
                      <Route path="integrations" element={<Integrations />} />
                      <Route path="settings" element={<SchoolSettings />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ThemeProvider>
              <ReactQueryDevtools />
            </QueryClientProvider>
          </AppProvider>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
};

export default App;
