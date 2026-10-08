import { RouterProvider } from "react-router";

import { AppErrorBoundary } from "@/app/components/AppErrorBoundary";
import { router } from "@/app/router";
import { LocalizationProvider } from "@/shared/design-system/localization/contexts/LocalizationContext";

export default function App() {
  return (
    <LocalizationProvider>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </LocalizationProvider>
  );
}
