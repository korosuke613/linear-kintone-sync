module.exports = {
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) =>
    `${defaultCommand} --access public`,
  installCommand: ({ isYarn }) =>
    isYarn ? "yarn install --silent" : "npm install",
};
