//Rules as per pre-alpha
var fs = require('fs');
var path = require('path')
var XLSX = require('xlsx');
var utils = require('./utils.js')
var lengthCheck = utils.lengthCheck;
var getRowDimension = utils.getRowDimension;
var getHeaderDimension = utils.getHeaderDimension;
var tablify = utils.tablify;


function Tablor(options) {
  if (!options) options = {}
  var headers = options.headers || []
  var row_data = options.row_data || []
  var row_dimension = null;
  var header_dimension = null;
  this.table_height = 0;
  //Given row_data without headers.
  if(headers.length==0 && row_data.length) {
    if (lengthCheck(row_data)) {
      this.headers = headers;
      this.row_data = row_data;
      this.row_dimension = row_data[0].length
      this.table_height = this.table_height+row_data.length;
    }
    else {throw new Error('Length of rows are not same!')}
  }
  //Given both headers and row_data
  else if(headers.length && row_data.length) {
    var xd = row_data[0].length;
    if (lengthCheck(row_data) && xd == headers.length) {
      this.headers = headers;
      this.row_data = row_data;
      this.row_dimension = xd;
      this.header_dimension = headers.length;
      this.table_height =this.table_height+ row_data.length;
    }
    else {throw new Error('Length of one/more rows is not same as number of headers!')}
  }
  else {
    //Given headers without row_data or no headers - no row_data
    this.headers = headers;
    this.row_data = row_data;
    this.header_dimension = headers.length;
  }
}

Tablor.prototype.getHeaders = function () {
  return this.headers;
};

Tablor.prototype.setHeaders = function (headers=[]) {
  //Headers can be set before or after setting row_data
  if(this.row_dimension) {
    //row data is set
    if (this.row_dimension == headers.length) {
      this.headers = headers;
    }
    else {throw new Error('Cannot set headers! Dimensions of headers and row data is not matching!')}
  }
  else{
    //row data is not set!
    this.headers = headers;
    this.header_dimension = headers.length;
  }
}


Tablor.prototype.addRow = function (row) {
  //row can be added with or without headers!
  //console.log(this.table_height);
  this.table_height = this.table_height+1;
  if(this.row_dimension) {
    //if data is already set!
    if(row.length == this.row_dimension) {
      //checking if dimension of adding row is same as already added rows.
      this.row_data.push(row);
    }
    else {throw new Error('Dimension of the row is not equal to already entered data dimensions!')}
  }
  else if(this.headers.length) {
    //if data is not set but headers is set.
    if(row.length == this.headers.length) {
      //checking is header dimensions is same as row dimensions.
      this.row_dimension = row.length;
      this.row_data.push(row);
    }
    else {throw new Error('Dimension of the row is not equal to header dimensions!')}
  }
  else {
    this.row_data.push(row);
    this.row_dimension = row.length;
  }
};


Tablor.prototype.addColumn = function (column_data,header="") {
};


Tablor.prototype._table = function () {
  var complete_table = [];
  // var cli_table = "";
  if(this.header_dimension) {
    complete_table.push(this.headers);
  }
  for(var i in this.row_data){
    complete_table.push(this.row_data[i]);
  }

  // return tablify(complete_table,this.header_dimension);
  return complete_table
};


Tablor.prototype.json = function () {
  //This should actually output a list of dictionaries.
  //if headers is not set, output the array of arrays!
  var headers = this.headers;
  var row_data = this.row_data;
  // console.log("json",this.row_data);
  var output = [];
  if (!this.header_dimension) {
    return this.row_data;
  }
  else {
    result = row_data.map(function (r) {
        var object = {};
        headers.forEach(function (k, i) {
            object[k] = r[i];
        });
        return object;
    });
  return JSON.stringify(result);
  }
};

Tablor.prototype.csv = function () {
  var headers = this.headers;
  var row_data = this.row_data;
  var output_csv;
  if(this.header_dimension) {
    output_csv = headers.join(',')+'\n';
  }
  else {
    output_csv = '';
  }
  for(var i in row_data){
    output_csv = output_csv + row_data[i].join(',');
    if(i<row_data.length-1) {output_csv+='\n';}
  }
  return output_csv;
}

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}


function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}


function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}


Tablor.prototype.xlsx = function () {
  var headers = this.headers;
  var rdata = this.row_data.slice(0);
  if(this.header_dimension){
    rdata.unshift(headers);
  }
  var ws_name = "Tablor";
  var wb = Workbook(), ws = sheet_from_array_of_arrays(rdata);
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  XLSX.writeFile(wb, 'output.xlsx');
};


Tablor.prototype.import = function (file) {
  var fileExtension = path.extname(file).substring(1);
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
  });
}


Tablor.prototype.getRow = function(row_number) {
  if(this.row_dimension && row_number<this.row_data.length && row_number>=0){
    return this.row_data[row_number];
  }
  else {
    throw new Error("No row with that row number is available!")
  }
}

Tablor.prototype.getColumn = function(column_number) {
  var output = [];
  if(column_number>=0 && column_number<this.row_data.length){
    var complete_table = this._table();
    for(var i in complete_table) {
      output.push(complete_table[i][column_number]);
    }
    return output;
  }
  else {
    throw new Error("No column with that column given is available!")
  }
}


Tablor.prototype.getElement = function (row_number,column_number) {
  if(row_number>=0 && row_number<this.row_data.length && column_number>=0 && column_number<this.row_data.length){
    var complete_table = this._table();
    if(this.header_dimension){
      //don't consider the header a part of the table.
      return complete_table[row_number+1][column_number];
    }
    else{
      //console.log(complete_table[row_number]);
      return complete_table[row_number][column_number];
    }
  }
  else {
    throw new Error("Given row or column number bigger than table dimension, kindly check!")
  }
};



module.exports = Tablor;
