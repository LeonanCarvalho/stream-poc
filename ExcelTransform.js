const Stream = require("stream");
const Excel = require("exceljs");

module.exports = class ExcelTransform extends Stream.Transform {
  constructor(columns) {
    super({ objectMode: true });

    const writable = new Stream.Writable({
      objectMode: false,
    });

    const that = this;
    writable._write = function (chunk, _encoding, next) {
      that.push(chunk);
      next();
    };

    //Como fazer múltiplos worksheets? Talvez utilizar métodos de set/get para esses objetos
    //Limitações, só seria possível criar um sheet por vez,
    // mas talvez seja possível adicionar no objeto do row a referencia de qual sheet e
    // usar o método workbook.getWorksheet('Nome'); para invocar o addRow
    this.workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: writable });
    this.worksheet = this.workbook.addWorksheet("sheet 1");
    this.worksheet.columns = columns;
  }

  _transform(row, _encoding, callback) {
    this.worksheet.addRow(row).commit();

    callback();
  }

  _flush(_callback) {
    this.workbook.commit(); // final commit
  }
};
