const { readdirSync, statSync } = require("fs");
const path = require("path");
const { dir } = require("console");

const generateSidebar = (originPath) => {
  let out = getTree(originPath)

  return out;
};

const getTree = (dirPath, items = []) => {
  files = readdirSync(dirPath);

  files.forEach((file) => {
    console.log(file);
    if (statSync(dirPath + "/" + file).isDirectory()) {
      const out = {
        label: file.charAt(0).toUpperCase() + file.slice(1),
        type: "category",
        items: getTree(dirPath + "/" + file, []),
      };
      items.push(out);
    } else {
      items.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return items;
};

module.exports = generateSidebar;
