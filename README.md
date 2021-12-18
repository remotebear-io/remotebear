# Remotebear

Source code of [remotebear.io](https://remotebear.io).

&nbsp;

<p align="center" margin-bottom="0">
  <a href="https://remotebear.io">
    <img alt="Remotebear" width="820" height="auto" src="./.github/screenshot.png">
  </a>
</p>

## Technology & Architecture

Remotebear is a [NextJS](https://nextjs.org/) web application that gathers job offers from public APIs or by scraping public websites using a Node script.
The entire codebase and "database" are contained in the repo [remotebear-io/remotebear repo](https://github.com/remotebear-io/remotebear) and is organized using [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

__High-level arch:__
![](/.github/high-level-arch.png)

__Services overview:__
![](/.github/flow.png)

The way Remotebear collects remote jobs is the following:

1. In the repo I'm storing a `companies-data.json` file, which keeps track of what companies we're interested in. It holds information about the company name, URL, description, and about how their remote positions should be collected (AKA from which job board, like [Greenhouse](https://www.greenhouse.io/), [Lever](https://www.lever.co/), etc...).
2. Every `n` hours, I run a Node script on Heroku that, given `companies-data.json`, collects each company remote job, normalizes it (e.g.: normalize locations like "Remote - New York only" into more scoped "us", "eu", "global" buckets), and submits a pull request to the repo with the goal of saving the collected remote jobs in a JSON file called `jobs-data.json`.
3. If the pull request tests pass, [Bulldozer](https://github.com/palantir/bulldozer) automatically merges it.

Here's a pull request example:


![](/.github/pull-request.png)

__All the static data that populates Remotebear lives in the repo as huge JSON objects__.  
Why? Because this pattern is working well enough for our current use case.    
Does it scale well? No.  
Are we planning to scale? Who knows.  

Remotebear's website is built with NextJS, is hosted on [Vercel](http://vercel.com/), and uses SSR to grab the jobs/companies data from distributed serverless functions that expose `jobs-data.json` and `company-data.json` (they just read them once loaded and keep them in memory).  
For jobs and companies data, we set a long caching window at the edge — but we never show stale data because every time the pull request with updated jobs is merged, Vercel starts a new build, invalidating the entire cache.  
Immutable assets (e.g.: fonts, images, etc...) are also cached on the browser.  
Basically, the way we store and use data on the front-end is a mixture between [State Site Generation](https://jamstack.org/generators/) and Server Side Rendering; we're not going all-in with a Static Site Generation approach because pagination, search, and filtering, would still require some kind of Server Side Rendering to generate the pages on-demand. 

## Repo structure

### `packages/data`

All the static data that populates Remotebear lives in this package as JSON objects.  

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

Logic used to normalize job departments and (especially!) locations.
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
