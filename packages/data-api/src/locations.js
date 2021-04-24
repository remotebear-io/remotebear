const locationsData = require("@remotebear/data/locations/locations-data.json");

const locationIds = locationsData.reduce((acc, location) => {
  acc[location.id] = location.id;
  return acc;
}, {});

const allLocationsById = locationsData.reduce((acc, location) => {
  acc[location.id] = location;
  return acc;
}, {});

module.exports = {
  allLocations: locationsData,
  allLocationsById,
  locationIds,
};
