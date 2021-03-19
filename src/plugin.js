"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedoc_1 = require("typedoc");
const MarkdownPlugin = require("typedoc-plugin-markdown");
const front_matter_1 = require("./front-matter");
const options_1 = require("./options");
const render_1 = require("./render");
const sidebar_1 = require("./sidebar");
async function generate(siteDir, opts) {
    // we need to generate an empty sidebar up-front so it can be resolved from sidebars.js
    const options = options_1.getOptions(siteDir, opts);
    // if (options.sidebar) {
    //   writeSidebar(options.sidebar, 'module.exports=[];');
    // }
    // initialize and build app
    const app = new typedoc_1.Application();
    // load the markdown plugin
    MarkdownPlugin(app);
    // customise render
    app.renderer.render = render_1.render;
    // add plugin options
    options_1.addOptions(app);
    // bootstrap typedoc app
    app.bootstrap(options);
    // add frontmatter component to typedoc renderer
    app.renderer.addComponent('fm', new front_matter_1.FrontMatterComponent(app.renderer));
    // add sidebar component to typedoc renderer
    app.renderer.addComponent('sidebar', new sidebar_1.SidebarComponent(app.renderer));
    // return the generated reflections
    const project = app.convert();
    // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
    if (!project) {
        return;
    }
    // generate or watch app
    return app.generateDocs(project, options.outputDirectory);
}
exports.default = generate;
