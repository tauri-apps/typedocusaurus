"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAndWatch = void 0;
const fs = require("fs");
const path = require("path");
/**
 * Calls TypeDoc's `convertAndWatch` and force trigger sidebars refresh.
 */
const convertAndWatch = (app, options) => {
    const sidebarsJsPath = path.resolve(options.siteDir, 'sidebars.js');
    app.convertAndWatch(async (project) => {
        if (options.sidebar) {
            // remove typedoc sidebar from require cache
            delete require.cache[options.sidebar.sidebarPath];
            // force trigger a sidebars.js refresh
            const sidebarJsContent = fs.readFileSync(sidebarsJsPath);
            fs.writeFileSync(sidebarsJsPath, sidebarJsContent);
        }
        await app.generateDocs(project, options.outputDirectory);
    });
};
exports.convertAndWatch = convertAndWatch;
