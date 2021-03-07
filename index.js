// const core = require("@actions/core");
const { transformDocs } = require("./main");
const generateSidebar = require("./generateSidebar");
const { readFile, writeFile, rmdir } = require("fs").promises;

(async () => {
  try {
    // Where your docs live, should be the folder containing the crates docs
    const originPath = process.env["originPath"]; // e.g. "/path/to/project/src/";

    // Where you'll save your MD files
    const targetPath = process.env["targetPath"]; // e.g. "/path/to/docusaurus/website/docs/api/js/";

    /*
    Where lives your sidebars config file
    Doesn't have to be JSON but it's easier to change programmatically, 
    you may create your own saving method
    */
    const sidebarPath = process.env["sidebarPath"]; // e.g. "/path/to/docusaurus/website/sidebars.json";

    // rustdoc uses relative links for crate types relations
    // const linksRoot = core.getInput("linksRoot"); // e.g. "/docs/api/rust/";

    // await Promise.all(
    //   entryPoints.map((entryPoint) =>
    //     rmdir(targetPath + entryPoint, { recursive: true })
    //   )
    // );

    // const sidebarItems = (
    //   await Promise.all(
    //     entryPoints.map(async (entryPoint) => ({
    //       entryPoint,
    //       docs: await transformDocs(
    //         originPath + entryPoint,
    //         originPath,
    //         targetPath
    //       ),
    //     }))
    //   )
    // ).map((item) => generateSidebar(item.docs, item.entryPoint, originPath));
    
    const sidebarItems = generateSidebar(originPath)

    // Automatically add the sidebar items to Docusaurus sidebar file config
    const sidebarContent = JSON.parse(await readFile(sidebarPath, "utf-8"));
    const index = sidebarContent.docs[3].items
      .map((row, index) => (row.label && row.label === "JavaScript" ? index : 0))
      .reduce((accumulator, value) => accumulator + value);
    sidebarContent.docs[3].items[index].items = sidebarItems; // Specify where to put the items
    
    console.log(sidebarContent.docs[3].items[index].items);
    // writeFile(sidebarPath, JSON.stringify(sidebarContent, null, 2));

    console.log("Tasks completed!");
  } catch (error) {
    throw error
    // core.setFailed(error.message);
  }
})();