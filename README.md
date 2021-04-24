# Remotebear

Source code of [remotebear.io](https://remotebear.io).

&nbsp;

<p align="center" margin-bottom="0">
  <a href="https://remotebear.io">
    <img alt="Remotebear" width="820" height="auto" src="./.github/screenshot.png">
  </a>
</p>

## Technology & Architecture

Remotebear is a NextJS web application that gathers job offers from public APIs or by scraping public websites using a Node script.
The entire codebase and database is contained in this repo and is organized using [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

The way Remotebear collects remote jobs is the following:

1. In this repo, under `packages/data/companies` we're storing a `companies-data.json` file, which keeps track of what companies we're interested in. It holds information about the company name, URL, description, and about how its remote positions should be collected (AKA from which job board, like [Greenhouse](https://www.greenhouse.io/), [Lever](https://www.lever.co/), etc...).
2. Every `n` hours, we run a Node script (`packages/scraper`) on Heroku that, given `companies-data.json`, collects each company remote job, normalizes it (e.g.: normalizes the location and department using `packages/normalizer`), and submits a pull request to the repo itself with the goal of saving the collected remote jobs in `packages/data/jobs/jobs-data.json`.
3. If the pull request tests pass, [Bulldozer](https://github.com/palantir/bulldozer) automatically merges it.

Remotebear's website (`packages/website`) is built using NextJS, hosted on Vercel, and uses SSR to grab the jobs/companies data from distributed serverless functions that expose `jobs-data.json` and `company-data.json` (they just read them once loaded and keep them in memory). For jobs and companies data, we set a long caching window at the edge — but we never show stale data because every time the pull request above is merged, Vercel starts a new build, invalidating the entire cache. Immutable assets (e.g.: fonts, images, etc...) are cached on the browser.

## Repo structure

### `packages/data`

All the static data that populates Remotebear lives in this package as JSON objects — yes, we are basically keeping the database in the repo 🍉.
Why? Because this pattern is working well enough for our current use case.  
Does it scale well? No.
Are we planning to scale? Who knows.

In this package you can find:

- `companies`: Companies configs and metadata.
- `departments`: Departments enums/labels.
- `jobs`: The entire list of remote jobs shown on the website.
- `location-patterns`: List of rules used to normalize job locations.
- `locations`: Location enums/labels.

### `packages/data-api`

Thin API layer on top of `packages/data` that abstracts the data usage. Other packages should use this instead of accessing the data directly.

In this package you can find the following scripts:

- `create-company`: Create a new company configuration.
- `update-company-metadata`: Update company metadata (by getting it from Crunchbase).

Environment variables:

- `CRUNCHBASE_API_KEY`: Required to use `update-company-metadata`.

### `packages/normalizer`

Logic used to normalize job departments and locations (especially locations).
Our goal here is to normalize locations like "Remote - New York only" into more scoped buckets ("us", "eu", "global", etc...) in order to let users filter them.
This is done is using a mixture of generic (`packages/data/location-patterns`) and company-specific rules/patterns.

In this package you can find the following scripts:

- `check-normalizations`: Helper that recaps successful/failed validations.
- `print-locations-for-test-file`: Helper that prints the normalized location of a specific company (from `jobs-data.json`) that can be then manually copy-pasted in `packages/normalizer/src/location-normalizer.mock.json` to prevent regressions.

### `packages/scraper`

Collects the job positions and creates a pull request on GitHub with the updated jobs.
The script can be run using `yarn start` or `yarn scrape`.

Important modules here are:

- `src/company-configs`: Company-specific rules and customizations. Companies that don't have a specific config will fall back to the settings defined in `packages/data/companies/companies-data.json` and to the default normalization logic.
- `src/services/github-api.js`: Logic that handles creating the GitHub pull request. Requires a `GITHUB_API_TOKEN` to run.
- `src/strategies.js`: Strategies used to collect the job positions. E.g.: Greenhouse API, Lever API, etc...
- `src/scrape-jobs.js`: The scraping pipeline.
- `scripts/scrape.js`: The scraping script.

Required environment variables:

- `GITHUB_API_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `CRUNCHBASE_API_KEY`

### `packages/website`

Remotebear website — it's a NextJS app hosted on Vercel.

## Feedback & Roadmap

Future roadmap and contribution guidelines are still a work in progress.

## License

Remotebear is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can find it [here](./LICENSE.md).
