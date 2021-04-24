const fs = require("fs");
const globby = require("globby");

async function generateSitemap() {
  // Fetch all routes based on patterns
  // Your folder structure might be different so change bellow to match your needs
  const pages = await globby([
    "pages/**/*.js", // All routes inside /pages
    "!pages/**/[*.js", // Ignore my dynamic route index
    "!pages/_*.js", // Ignore next.js files
    "!pages/404.js", // Ignore 404 page
    "!pages/api", // Ignore API routes
  ]);

  const urlSet = pages
    .map((page) => {
      // Remove none route related parts of filename.
      const path = page.replace("pages", "").replace(/(.js)/, "");
      // Remove the word index from route
      const route = path === "/index" ? "" : path;
      // Top priority for index and companies page
      const priority = ["/index", "/companies"].includes(path) ? "1.0" : "0.5";
      // Build url portion of sitemap.xml
      return `<url><loc>https://remotebear.io${route}</loc><priority>${priority}</priority><changefreq>daily</changefreq></url>`;
    })
    .join("");

  // Add urlSet to entire sitemap string
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`;

  // Create sitemap file
  fs.writeFileSync("public/sitemap.xml", sitemap);

  console.log("Generated public/sitemap.xml");
}

module.exports = generateSitemap;
