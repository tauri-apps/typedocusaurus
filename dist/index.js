/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 975:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _module = __nccwpck_require__(282);

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: type ParentType = {
  children: Array<any>,
  exports: any,
  filename: string,
  id: string,
  loaded: boolean,
  parent: any,
  paths: Array<string>
};*/ // @flow

/*:: type IsOverrideType = (request: string, parent: ParentType) => boolean;*/
/*:: type ResolverOverrideType = (request: string, parent: ParentType) => any;*/


/**
 * @param isOverride A condition used to check whether to override Module._load.
 * @param resolveOverride A function used to override Module._load result.
 */
/*:: type OverrideRequireType = (...rest: Array<void>) => void;*/

exports.default = (isOverride /*: IsOverrideType*/, resolveOverride /*: ResolverOverrideType*/) /*: OverrideRequireType*/ => {
  const originalLoad = _module2.default._load;

  // eslint-disable-next-line id-match
  _module2.default._load = function (request /*: string*/, parent /*: ParentType*/) {
    if (isOverride(request, parent)) {
      return resolveOverride(request, parent);
    }

    // eslint-disable-next-line prefer-rest-params
    return originalLoad.apply(this, arguments);
  };

  return () => {
    // eslint-disable-next-line id-match
    _module2.default._load = originalLoad;
  };
};

module.exports = exports['default'];

/***/ }),

/***/ 879:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ generate)
});

;// CONCATENATED MODULE: external "typedoc"
const external_typedoc_namespaceObject = require("typedoc");;
;// CONCATENATED MODULE: external "typedoc-plugin-markdown"
const external_typedoc_plugin_markdown_namespaceObject = require("typedoc-plugin-markdown");;
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(622);
// EXTERNAL MODULE: ./node_modules/@vercel/ncc/dist/ncc/@@notfound.js?typedoc/dist/lib/converter/components
var components = __nccwpck_require__(137);
// EXTERNAL MODULE: ./node_modules/@vercel/ncc/dist/ncc/@@notfound.js?typedoc/dist/lib/output/components
var output_components = __nccwpck_require__(813);
// EXTERNAL MODULE: ./node_modules/@vercel/ncc/dist/ncc/@@notfound.js?typedoc/dist/lib/output/events
var events = __nccwpck_require__(906);
// EXTERNAL MODULE: ./node_modules/@vercel/ncc/dist/ncc/@@notfound.js?typedoc-plugin-markdown/dist/resources/helpers/reflection-title
var reflection_title = __nccwpck_require__(794);
;// CONCATENATED MODULE: ./src/front-matter.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// @ts-ignore

// @ts-ignore

// @ts-ignore

// @ts-ignore

// @ts-ignore

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
const prependYAML = (contents, vars) => {
    return contents
        .replace(/^/, toYAML(vars) + '\n\n')
        .replace(/[\r\n]{3,}/g, '\n\n');
};
/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
const getPageTitle = (page) => {
    return reflection_title.reflectionTitle.call(page, false);
};
/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars) => {
    const yaml = `---
${Object.entries(vars)
        .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${escapeString(value)}"` : value}`)
        .join('\n')}
---`;
    return yaml;
};
// prettier-ignore
const escapeString = (str) => str.replace(/([^\\])'/g, '$1\\\'');
let FrontMatterComponent = class FrontMatterComponent extends output_components.RendererComponent {
    constructor() {
        super(...arguments);
        this.globalsFile = 'modules.md';
    }
    initialize() {
        super.initialize();
        // @ts-ignore
        this.listenTo(this.application.renderer, {
            [events.PageEvent.END]: this.onPageEnd,
        });
    }
    onPageEnd(page) {
        if (page.contents) {
            page.contents = prependYAML(page.contents, this.getYamlItems(page));
        }
    }
    getYamlItems(page) {
        const pageTitle = this.getTitle(page);
        const sidebarLabel = this.getSidebarLabel(page);
        let items = {
            title: pageTitle,
        };
        if (sidebarLabel && sidebarLabel !== pageTitle) {
            items = { ...items, sidebar_label: sidebarLabel };
        }
        return {
            ...items,
            custom_edit_url: null,
            hide_title: true,
        };
    }
    getSidebarLabel(page) {
        if (!this.sidebar) {
            return null;
        }
        if (page.url === this.entryDocument) {
            return page.url === page.project.url
                ? this.sidebar.indexLabel
                : this.sidebar.readmeLabel;
        }
        if (page.url === this.globalsFile) {
            return this.sidebar.indexLabel;
        }
        return this.sidebar.fullNames ? page.model.getFullName() : page.model.name;
    }
    getId(page) {
        return external_path_.basename(page.url, external_path_.extname(page.url));
    }
    getTitle(page) {
        const readmeTitle = this.readmeTitle || page.project.name;
        if (page.url === this.entryDocument && page.url !== page.project.url) {
            return readmeTitle;
        }
        return getPageTitle(page);
    }
};
__decorate([
    (0,external_typedoc_namespaceObject.BindOption)('out')
], FrontMatterComponent.prototype, "out", void 0);
__decorate([
    (0,external_typedoc_namespaceObject.BindOption)('sidebar')
], FrontMatterComponent.prototype, "sidebar", void 0);
__decorate([
    (0,external_typedoc_namespaceObject.BindOption)('globalsTitle')
], FrontMatterComponent.prototype, "globalsTitle", void 0);
__decorate([
    (0,external_typedoc_namespaceObject.BindOption)('readmeTitle')
], FrontMatterComponent.prototype, "readmeTitle", void 0);
__decorate([
    (0,external_typedoc_namespaceObject.BindOption)('entryDocument')
], FrontMatterComponent.prototype, "entryDocument", void 0);
FrontMatterComponent = __decorate([
    (0,components.Component)({ name: 'front-matter' })
], FrontMatterComponent);


;// CONCATENATED MODULE: ./src/options.ts


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
                sidebarPath: external_path_.resolve(siteDir, sidebar.sidebarFile),
            },
        };
    }
    // additional
    options = {
        ...options,
        siteDir,
        outputDirectory: external_path_.resolve(siteDir, options.docsRoot, options.out),
    };
    return options;
};
/**
 * Add docusaurus options to converter
 * @param app
 */
const addOptions = (app) => {
    // configure deault typedoc options
    app.options.addReader(new external_typedoc_namespaceObject.TypeDocReader());
    app.options.addReader(new external_typedoc_namespaceObject.TSConfigReader());
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
        type: external_typedoc_namespaceObject.ParameterType.Mixed,
    });
};

;// CONCATENATED MODULE: ./src/render.ts
// @ts-ignore

async function render(project, outputDirectory) {
    var _a;
    if (!this.prepareTheme() || !this.prepareOutputDirectory(outputDirectory)) {
        return;
    }
    const output = new events.RendererEvent(events.RendererEvent.BEGIN, outputDirectory, project);
    output.settings = this.application.options.getRawValues();
    output.urls = this.theme.getUrls(project);
    this.trigger(output);
    if (!output.isDefaultPrevented) {
        (_a = output.urls) === null || _a === void 0 ? void 0 : _a.forEach((mapping, i) => {
            var _a;
            this.renderDocument(output.createPageEvent(mapping));
            console.log(`\rGenerated ${i + 1} of ${(_a = output.urls) === null || _a === void 0 ? void 0 : _a.length} TypeDoc docs`);
        });
        console.log(`\n`);
        this.trigger(events.RendererEvent.END, output);
    }
}

// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(747);
;// CONCATENATED MODULE: ./src/sidebar.ts
var sidebar_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// @ts-ignore

// @ts-ignore

// @ts-ignore

// @ts-ignore

let SidebarComponent = class SidebarComponent extends output_components.RendererComponent {
    initialize() {
        // @ts-ignore
        this.listenTo(this.application.renderer, {
            [events.RendererEvent.BEGIN]: this.onRendererBegin,
        });
    }
    async onRendererBegin(renderer) {
        var _a;
        // @ts-ignore
        const navigation = (_a = this.application.renderer.theme) === null || _a === void 0 ? void 0 : _a.getNavigation(renderer.project);
        const out = this.out.match(/(?:.*)en\/(.*)/)[1];
        // map the navigation object to a Docuaurus sidebar format
        const sidebarItems = (navigation === null || navigation === void 0 ? void 0 : navigation.children)
            ? navigation.children.map((navigationItem) => {
                if (navigationItem.isLabel) {
                    const sidebarCategoryItems = navigationItem.children
                        ? navigationItem.children.map((navItem) => {
                            const url = this.getUrlKey(out, navItem.url);
                            if (navItem.children && navItem.children.length > 0) {
                                const sidebarCategoryChildren = navItem.children.map((childGroup) => this.getSidebarCategory(childGroup.title, childGroup.children
                                    ? childGroup.children.map((childItem) => this.getUrlKey(out, childItem.url))
                                    : []));
                                return this.getSidebarCategory(navItem.title, [
                                    url,
                                    ...sidebarCategoryChildren,
                                ]);
                            }
                            return url;
                        })
                        : [];
                    return this.getSidebarCategory(navigationItem.title, sidebarCategoryItems);
                }
                return this.getUrlKey(out, navigationItem.url);
            })
            : [];
        const sidebarPath = this.sidebar.sidebarPath;
        external_fs_.writeFileSync(sidebarPath, JSON.stringify(sidebarItems, null, 2));
        // @ts-ignore
        this.application.logger.success(`TypeDoc sidebar written to ${sidebarPath}`);
    }
    /**
     * returns a sidebar category node
     */
    getSidebarCategory(title, items) {
        return {
            items,
            type: 'category',
            label: title,
        };
    }
    /**
     * returns the url key for relevant doc
     */
    getUrlKey(out, url) {
        const urlKey = url.replace('.md', '');
        return out ? out + '/' + urlKey : urlKey;
    }
};
sidebar_decorate([
    (0,external_typedoc_namespaceObject.BindOption)('sidebar')
], SidebarComponent.prototype, "sidebar", void 0);
sidebar_decorate([
    (0,external_typedoc_namespaceObject.BindOption)('siteDir')
], SidebarComponent.prototype, "siteDir", void 0);
sidebar_decorate([
    (0,external_typedoc_namespaceObject.BindOption)('out')
], SidebarComponent.prototype, "out", void 0);
SidebarComponent = sidebar_decorate([
    (0,components.Component)({ name: 'sidebar' })
], SidebarComponent);

/**
 * Write content to sidebar file
 */
const writeSidebar = (sidebar, content) => {
    if (!fs.existsSync(path.dirname(sidebar.sidebarPath))) {
        fs.mkdirSync(path.dirname(sidebar.sidebarPath));
    }
    fs.writeFileSync(sidebar.sidebarPath, content);
};

;// CONCATENATED MODULE: ./src/plugin.ts
// @ts-ignore

// @ts-ignore





async function generate(siteDir, opts) {
    // we need to generate an empty sidebar up-front so it can be resolved from sidebars.js
    const options = getOptions(siteDir, opts);
    // if (options.sidebar) {
    //   writeSidebar(options.sidebar, 'module.exports=[];');
    // }
    // initialize and build app
    const app = new external_typedoc_namespaceObject.Application();
    // load the markdown plugin
    (0,external_typedoc_plugin_markdown_namespaceObject.load)(app);
    // customise render
    app.renderer.render = render;
    // add plugin options
    addOptions(app);
    // bootstrap typedoc app
    app.bootstrap(options);
    // add frontmatter component to typedoc renderer
    // @ts-ignore
    app.renderer.addComponent('fm', new FrontMatterComponent(app.renderer));
    // add sidebar component to typedoc renderer
    // @ts-ignore
    app.renderer.addComponent('sidebar', new SidebarComponent(app.renderer));
    // return the generated reflections
    const project = app.convert();
    // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
    if (!project) {
        return;
    }
    // generate or watch app
    return app.generateDocs(project, options.outputDirectory);
}


/***/ }),

/***/ 794:
/***/ ((module) => {

module.exports = eval("require")("typedoc-plugin-markdown/dist/resources/helpers/reflection-title");


/***/ }),

/***/ 137:
/***/ ((module) => {

module.exports = eval("require")("typedoc/dist/lib/converter/components");


/***/ }),

/***/ 813:
/***/ ((module) => {

module.exports = eval("require")("typedoc/dist/lib/output/components");


/***/ }),

/***/ 906:
/***/ ((module) => {

module.exports = eval("require")("typedoc/dist/lib/output/events");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("module");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
let core = __nccwpck_require__(186);
const { rmdir } = __nccwpck_require__(747).promises;
const path = __nccwpck_require__(622);
const overrideRequire = __nccwpck_require__(975);
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
        const resolveRequest = (request) => require(path.normalize(process.cwd().replace("/dist/typedocusaurus", "") + `/${originPath}node_modules/${request}`));
        overrideRequire(overrideCondition, resolveRequest);
        const { default: generate } = __nccwpck_require__(879);
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
    }
    catch (error) {
        core.setFailed(error.message);
    }
})();

})();

module.exports = __webpack_exports__;
/******/ })()
;