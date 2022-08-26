const fs = require("fs");
const Stream = require("stream");
const ExcelTransform = require("./ExcelTransform");
const { defer, startMetric } = require("./metric");
const data = require("./data");

//startMetric(); // Está dando  Segmentation fault (core dumped) com esse volume, até uns 200 items é safe
new Promise((resolve, reject) => {
  try {
    const rs = new Stream.Readable({ objectMode: true });

    //1 000 000 de linhas simuladas em 10k de páginas e 100 itens por página (menor alocação de memória)
    const numPages = 10000;
    for (let i = 0; i < numPages; i++) {
      let someData = data(100);
      someData.forEach((d) => {
        rs.push(d);
      });
    }

    rs.push(null);

    // Escreve diretamente para o arquivo,
    const writeStream = fs.createWriteStream("data.xlsx");
    // Porém isso teria que ser feito para um stream de upload do s3
    function uploadFromStream(s3) {
      const pass = new Stream.PassThrough();

      const s3params = { Bucket: BUCKET, Key: KEY, Body: pass };
      s3.upload(s3params, (err, data) => {
        console.log(err, data);
      });

      return pass;
    }
    //const writeStream =  uploadFromStream(s3);

    rs.pipe(
      new ExcelTransform([
        {
          header: "Id",
          key: "id",
        },
        {
          header: "Date",
          key: "data",
        },
        {
          header: "Text",
          key: "string",
        },
        {
          header: "Float",
          key: "float",
        },
      ])
    )
      //.pipe(process.stdout) //Debug
      .pipe(writeStream)
      .on("end", () => {
        console.info("Done!");
        writeStream.end();
      })
      .on("error", (error) => {
        console.error(error.message);
        writeStream.end();
      });
    resolve();
  } catch (e) {
    reject(e);
  }
}).finally(defer);
