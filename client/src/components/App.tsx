import { memo } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/swrService";
import PageRoutes from "./PageRoutes";

function App() {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        fetcher,
      }}
    >
      <PageRoutes />
    </SWRConfig>
  );
}

export default memo(App);
