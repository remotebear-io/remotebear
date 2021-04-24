const fs = require("fs");

const crawlableRobotsTxt = `User-agent: *\nAllow: /\n\nSitemap: https://remotebear.io/sitemap.xml`;

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

function generateRobotsTxt() {
  // Create a non-crawlable robots.txt in preview links
  const robotsTxt =
    process.env.VERCEL_ENV === "production"
      ? crawlableRobotsTxt
      : uncrawlableRobotsTxt;

  // Create robots.txt file
  fs.writeFileSync("public/robots.txt", robotsTxt);

  console.log(
    `Generated a ${
      process.env.VERCEL_ENV === "production" ? "crawlable" : "non-crawlable"
    } public/robots.txt`
  );
}

module.exports = generateRobotsTxt;
