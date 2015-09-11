var fs = require("fs");
var file = JSON.parse(fs.readFileSync("src/lookups/provinces.json", "utf8"));


for (i = 0; i < file.length; i++) {
  console.log(file[i].Province);
}
