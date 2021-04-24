const fetch = require("node-fetch");

async function getJobsFromWorkday(workdayCompanyUrl) {
  const { origin } = new URL(workdayCompanyUrl);
  let responseRaw = await fetch(workdayCompanyUrl, {
    headers: {
      accept: "application/json,application/xml",
    },
  });

  const data = [];
  let jobs = [];
  let response;

  while (responseRaw.status === 200) {
    response = await responseRaw.json();

    let paginationUrl = origin;

    const { uri: paginationUri } = response.body.children
      .find(({ widget }) => widget === "facetSearchResult")
      .endPoints.find(({ type }) => type === "Pagination");
    paginationUrl = origin + paginationUri;

    jobs = response.body.children
      .find(({ widget }) => widget === "facetSearchResult")
      .children.find(({ widget }) => widget === "facetSearchResultList")
      .listItems;

    if (!jobs) {
      break;
    }

    jobs.forEach((jobInfo) => {
      data.push({
        department: "",
        url: `${origin}${jobInfo.title.commandLink}/`,
        id: `${jobInfo.subtitles[0].instances[0].text}`,
        title: jobInfo.title.instances[0].text,
        location:
          (jobInfo.title.instances[0].text.toLowerCase().includes("remote")
            ? "Remote, "
            : "") +
          jobInfo.subtitles[1].instances[0].text.replace(
            /( - Other)?, More\.\.\./,
            " and other options"
          ),
        _updatedAt: parseCreatedAt(jobInfo.subtitles[2]),
      });
    });

    responseRaw = await fetch(`${paginationUrl}/${data.length.toString()}`, {
      headers: {
        accept: "application/json,application/xml",
      },
    });
  }

  return data;
}

function parseCreatedAt(jobDataPart) {
  let daysFromToday;
  if (!jobDataPart || jobDataPart.instances[0].text === "Posted Today") {
    daysFromToday = 0;
  } else if (jobDataPart.instances[0].text === "Posted Yesterday") {
    daysFromToday = 1;
  } else {
    daysFromToday = jobDataPart.instances[0].text.match(
      /Posted (\d+)\+? Days Ago/
    )[1];
  }

  const creationDate = new Date();

  creationDate.setUTCHours(12, 0, 0, 0);
  creationDate.setUTCDate(creationDate.getUTCDate() - parseInt(daysFromToday));

  return creationDate.getTime();
}

module.exports = {
  getJobsFromWorkday,
};
