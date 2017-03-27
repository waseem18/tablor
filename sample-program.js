var Tablor = require('tablor')


var data = new Tablor()
//OR
var data = new Tablor({headers:["First name","Last name"]})
//OR
var data = new Tablor({headers:["First name","Last name"],row_data:[["wasim","thabraze"],["waseem","tabraze"]]})

//Columns should be unique

data.import('pathToRequiredFile')
// data.addRow(data)
data.addColumn(data,header)
// data.json()
// data.csv()
// data.xlsx()
// data.getRow(row_number);
// data.getColumn(column number);
// data.getElement(row_number,column number); //column name can also be passed instead of column number, let me first concentrate on pre-alpha! :D
data.height
data.width
