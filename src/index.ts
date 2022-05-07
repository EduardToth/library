// necessary to allow runtime require
// eslint-disable-next-line no-global-assign, @typescript-eslint/no-var-requires
require = require("esm")(module);
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require("./main.js").init();
