let core = require("@actions/core");
const { rmdir } = require("fs").promises;

const path = require("path");

const overrideRequire = require("override-require");
if (process.env.DEV) {
  core = {
    getInput: (variable) => process.env[variable],
    setFailed: (message) => console.log(message)
  };
}
(async () => {
  try {
    // Where your docs live, should be the folder containing the crates docs
    const originPath = core.getInput("originPath"); // e.g. "/path/to/project/src/";

    const sidebarFile = core.getInput("sidebarFile");
    // Where you'll save your MD files
    const targetPath = core.getInput("targetPath"); // e.g. "/path/to/docusaurus/website/docs/api/js/";
    const docusaurusPath = core.getInput("docusaurusPath");

    const overrideCondition = (request) => request.startsWith("typedoc");

    const resolveRequest = (request) =>
      require(path.normalize(
        process.cwd().replace("/dist/typedocusaurus", "") + `/${originPath}node_modules/${request}`
      ));

    overrideRequire(overrideCondition, resolveRequest);

    const { default: generate } = require("./plugin");

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
    core.setFailed(error.message);
  }
})();
