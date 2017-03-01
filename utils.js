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
  

};
