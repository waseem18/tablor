var cli_table = require('cli-table');
module.exports = {
  //checks if all rows in row_data are of same length are not!
  lengthCheck: function (row_data) {
    var l = row_data[0].length;
    var response = true;
    for(var i=0;i<row_data.length;i++) {
      if(row_data[i].length != l) {
        response = false;
      }
    }
    return response;
  },

  getRowDimension: function (row_data) {
    return row_data[0].length;
  },


  tablify(complete_table,header_dimension){
    var headers=[];
    var index=0;
    if(header_dimension){
      headers = complete_table[0];
      index=1;
    }
    var output = new cli_table({
      head: headers
    });

    for(i=index;i<complete_table.length;i++){
      output.push(complete_table[i]);
    }
    return output.toString();
}


};
