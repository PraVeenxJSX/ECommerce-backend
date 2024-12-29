const acData = require("./ac");
const computerData = require("./computers");
const fridgeData = require("./fridge");
const furnitureData = require("./furniture");
const kitchenData = require("./kitchen");
const menData = require("./men");
const mobileData = require("./mobiles");
const speakerData = require("./speaker");
const tvData = require("./tv");
const womanData = require("./woman");
const booksData = require("./books");

const allProducts = [
  ...acData,
  ...computerData,
  ...fridgeData,
  ...furnitureData,
  ...kitchenData,
  ...menData,
  ...mobileData,
  ...speakerData,
  ...tvData,
  ...womanData,
  ...booksData,
];

module.exports = allProducts;
