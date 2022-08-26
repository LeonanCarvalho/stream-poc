const { parse } = require("csv-parse");
const parser = parse({ columns: true }, function (err, records) {
  console.log("result", records);
});
fs.createReadStream(__dirname + "/data.csv").pipe(parser);
