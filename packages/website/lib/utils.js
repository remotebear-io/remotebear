// Creates an object composed of keys generated from the results of running each
// element of collection through iteratee.
export function keyBy(array, key) {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

export function getCurrentOrigin() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (!isServerSide()) {
    return window.location.origin; // eslint-disable-line
  }
  return "http://localhost:3000";
}

export function isServerSide() {
  return typeof window === "undefined";
}

/**
 * Fast comparison between two arrays of object (by key).
 * https://stackoverflow.com/a/42186143
 * @param {Array<Object>} a1 First array to compare.
 * @param {Array<Object>} a2 Second array to compare.
 * @param {string} key Object key used to compare the arrays.
 * @returns {bool} Are the two array equals?
 */
export function areArrayEqualsByKey(a1, a2, key) {
  return a1.every((value, index) => value[key] === a2[index]?.[key]);
}

export function times(n) {
  return Array.from({ length: n }, (_, x) => x);
}

export function buildJobsApiUrl({
  query,
  locationId,
  departmentId,
  companyId,
  page,
}) {
  const url = new URL(`/api/jobs`, getCurrentOrigin());
  url.searchParams.set("q", query || "");
  url.searchParams.set("l", locationId || "");
  url.searchParams.set("d", departmentId || "");
  url.searchParams.set("cid", companyId || "");
  url.searchParams.set("p", page || 0);
  return url.href;
}

export async function fetchApi(path) {
  const url = new URL(path, getCurrentOrigin());
  const response = await fetch(url);
  return response.json();
}

export async function fetchJobsApi(params) {
  const response = await fetch(buildJobsApiUrl(params));
  return response.json();
}

export function swrFetcher(resource, init) {
  return fetch(resource, init).then((res) => res.json());
}

export function isTouchDevice() {
  return (
    !isServerSide() &&
    (navigator.maxTouchPoints || "ontouchstart" in document.documentElement)
  );
}

export function sanitizeString(str) {
  return str.replace(/[^a-z0-9().,;-_ ]/gim, "");
}

export function prettifyUrl(fullUrl) {
  return new URL(fullUrl).host;
}
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
