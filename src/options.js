"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOptions = exports.getOptions = void 0;
const path = require("path");
const typedoc_1 = require("typedoc");
/**
 * Default plugin options
 */
const DEFAULT_PLUGIN_OPTIONS = {
    id: 'default',
    docsRoot: 'docs',
    out: 'api',
    entryDocument: 'index.md',
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    sidebar: {
        fullNames: false,
        sidebarFile: 'typedoc-sidebar.js',
        indexLabel: 'Table of contents',
        readmeLabel: 'Readme',
        sidebarPath: '',
    },
    plugin: ['none'],
    outputDirectory: '',
    siteDir: '',
    watch: false,
};
/**
 * Merge default with user options
 * @param opts
 */
const getOptions = (siteDir, opts) => {
    // base options
    let options = {
        ...DEFAULT_PLUGIN_OPTIONS,
        ...opts,
    };
    // sidebar
    if (opts.sidebar === null) {
        options = { ...options, sidebar: null };
    }
    else {
        const sidebar = {
            ...DEFAULT_PLUGIN_OPTIONS.sidebar,
            ...opts.sidebar,
        };
        options = {
            ...options,
            sidebar: {
                ...sidebar,
                sidebarPath: path.resolve(siteDir, sidebar.sidebarFile),
            },
        };
    }
    // additional
    options = {
        ...options,
        siteDir,
        outputDirectory: path.resolve(siteDir, options.docsRoot, options.out),
    };
    return options;
};
exports.getOptions = getOptions;
/**
 * Add docusaurus options to converter
 * @param app
 */
const addOptions = (app) => {
    // configure deault typedoc options
    app.options.addReader(new typedoc_1.TypeDocReader());
    app.options.addReader(new typedoc_1.TSConfigReader());
    // expose plugin options to typedoc so we can access if required
    app.options.addDeclaration({
        name: 'id',
    });
    app.options.addDeclaration({
        name: 'docsRoot',
    });
    app.options.addDeclaration({
        name: 'siteDir',
    });
    app.options.addDeclaration({
        name: 'outputDirectory',
    });
    app.options.addDeclaration({
        name: 'globalsTitle',
    });
    app.options.addDeclaration({
        name: 'readmeTitle',
    });
    app.options.addDeclaration({
        name: 'sidebar',
        type: typedoc_1.ParameterType.Mixed,
    });
};
exports.addOptions = addOptions;
