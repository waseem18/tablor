var Tablor = require('./index.js')

var data = new Tablor();
//var headers = data.getHeaders();
// console.log("Headers of table are : ",headers);
console.log(data);
data.setHeaders(["First name","Last name","age"]);
//var headers = data.getHeaders();
//console.log("Headers of table are : ",headers);

data.addRow(["random","name","16"])
data.addRow(["Sami","gadu","21"])
data.addRow(["ravi","teja","285"])
// console.log(data);
var table_data = data._table();
console.log(table_data)
console.log(data);
// var res = data.json();
// console.log(res);
// var res1 = data.xlsx();
// var res2 = data.csv();
// console.log(res2);
//


//Currently only .csv .json files can be imported.
//If it's a csv file, user needs to explicitly mention if headers are present are not.
//If it's json, Tablor assumes that it's with headers.
//data.import('./tasks.csv')
// console.log(data.getRow(1));
//console.log(data.getColumn(2));
//console.log(data.getElement(0,2));
//console.log(data.table_height);
