
let inputFileName = "";

let globalState = {
  data: [],
};
function setInputFileName(fileName) {
  inputFileName =fileName;

  }
  
  function resetData() {
    globalState.data = [];
  }
  
function getInputFileName() {
  return inputFileName
  }
module.exports = {setInputFileName,getInputFileName}  




