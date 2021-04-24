import { useState, useEffect } from "react";
import Head from "components/head";
import Layout from "components/layout";
import { Button } from "components/buttons";

export default function AnalystIgnore() {
  const [ignore, setIgnore] = useState(false);

  useEffect(() => {
    setIgnore(!!window.localStorage.plausible_ignore);
  }, []);

  useEffect(() => {
    if (ignore) {
      window.localStorage.plausible_ignore = "true";
    } else {
      delete window.localStorage.plausible_ignore;
    }
  }, [ignore]);

  return (
    <Layout>
      <Head
        description="Full-remote and remote-friendly companies and startup."
        pathname="/analytics-ignore"
      />
      <div className="flex-col">
        <div className="flex flex-col justify-center items-center mt-12 pb-12">
          <p className="mb-5">{`We are ${
            ignore ? "ignoring" : "tracking"
          } you`}</p>
          <Button
            onClick={() => {
              setIgnore(!ignore);
            }}
          >
            {`${ignore ? "Stop ignore" : "Ignore"} me from analytics`}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
