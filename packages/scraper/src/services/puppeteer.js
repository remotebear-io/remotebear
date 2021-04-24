const { Cluster } = require("puppeteer-cluster");

let cluster;

async function initialize() {
  cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteerOptions: {
      headless: true,
      args: ["--no-sandbox", "–disable-setuid-sandbox"],
    },
  });
}

async function teardown() {
  await cluster.idle();
  await cluster.close();
  cluster = undefined;
}

async function evaluatePage({ url, html, scriptTag, evaluate }) {
  const data = await cluster.execute(async ({ page }) => {
    if (html) {
      await page.setContent(html);
    } else {
      await page.goto(url);
    }
    if (scriptTag) {
      await page.addScriptTag(scriptTag);
    }
    return await page.evaluate(evaluate);
  });
  return data;
}

module.exports = {
  initialize,
  evaluatePage,
  teardown,
};
