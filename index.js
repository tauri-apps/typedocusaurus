// const core = require("@actions/core");
const { rmdir } = require("fs").promises;
const { default: generate } = require("./src/plugin");

(async () => {
  try {
    // Where your docs live, should be the folder containing the crates docs
    const originPath = process.env["originPath"]; // e.g. "/path/to/project/src/";

    const sidebarFile = process.env["sidebarFile"];
    // Where you'll save your MD files
    const targetPath = process.env["targetPath"]; // e.g. "/path/to/docusaurus/website/docs/api/js/";

    const docusaurusPath = process.env["docusaurusPath"];
    await rmdir(targetPath, { recursive: true });

    await generate(docusaurusPath, {
      entryPoints: originPath + "src",
      out: targetPath,
      entryDocument: "index.md",
      hideInPageTOC: true,
      hideBreadcrumbs: true,
      watch: false,
      tsconfig: originPath + "tsconfig.json",
      sidebar: {
        sidebarFile,
      },
      readme: "none",
    });

    console.log("Tasks completed!");
  } catch (error) {
    throw error;
    // core.setFailed(error.message);
  }
})();
