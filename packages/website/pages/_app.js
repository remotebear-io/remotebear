import { SWRConfig } from "swr";
import { swrFetcher } from "lib/utils";
import { PlausibleProvider } from "lib/plausible";
import "styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <PlausibleProvider>
      <SWRConfig value={{ fetcher: swrFetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </PlausibleProvider>
  );
}

export default App;
