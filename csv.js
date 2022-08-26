const { defer } = require("./metric");
new Promise((resolve, reject) => {
  try {
    const fs = require("fs");
    const Stream = require("stream");
    const { stringify } = require("csv-stringify/sync");

    const data = require("./data");

    const readable = new Stream.Readable({
      read() {
        return true;
      },
    });

    //Probably will require some compression to expose
    const writeStream = fs.createWriteStream("data.csv");

    readable
      .pipe(writeStream)
      .on("end", function () {
        writeStream.end();
      })
      .on("error", function (error) {
        console.error(error.message);
        writeStream.end();
      });

    const numPages = 50000;
    for (let i = 0; i < numPages; i++) {
      let someData = data(1000);
      let counter = 0;
      someData.forEach((d) => {
        const output = stringify([d], { header: counter === 0 });
        readable.push(Buffer.from(output, "utf-8"));
        counter++;
      });
    }

    readable.push(null); //End reading

    //readable.pipe(parser);
    /*     function uploadFromStream(s3) {
      var pass = new stream.PassThrough();

      var params = { Bucket: BUCKET, Key: KEY, Body: pass };
      s3.upload(params, function (err, data) {
        console.log(err, data);
      });

      return pass;
    }
    readable.pipe(uploadFromStream(s3)); */

    resolve();
  } catch (e) {
    reject(e);
  }
}).finally(defer);
