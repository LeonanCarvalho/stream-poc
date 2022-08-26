const memwatch = require("@airbnb/node-memwatch");
memwatch.on("leak", (info) => console.info(info));
//memwatch.on("stats", (stats) => console.info(stats));
//const hd = new memwatch.HeapDiff();

let hd;

const startMetric = () => {
  hd = new memwatch.HeapDiff();
};

const defer = () => {
  if (!hd) {
    return;
  }
  const diff = hd.end();

  console.info(
    `Before: ${diff.before.size}After: ${diff.after.size}\nChange: ${diff.change.size}\nChange History:\n`
  );

  diff.change.details.forEach((detail) => {
    console.info(`        ${detail.what}: ${detail.size}`);
  });
  hd = null;
};

module.exports = {
  memwatch,
  startMetric,
  defer,
};
