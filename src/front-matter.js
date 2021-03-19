"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontMatterComponent = exports.getPageTitle = exports.prependYAML = void 0;
const path = require("path");
const typedoc_1 = require("typedoc");
const components_1 = require("typedoc/dist/lib/converter/components");
const components_2 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const reflection_title_1 = require("typedoc-plugin-markdown/dist/resources/helpers/reflection-title");
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
exports.prependYAML = prependYAML;
/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
const getPageTitle = (page) => {
    return reflection_title_1.reflectionTitle.call(page, false);
};
exports.getPageTitle = getPageTitle;
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
let FrontMatterComponent = class FrontMatterComponent extends components_2.RendererComponent {
    constructor() {
        super(...arguments);
        this.globalsFile = 'modules.md';
    }
    initialize() {
        super.initialize();
        this.listenTo(this.application.renderer, {
            [events_1.PageEvent.END]: this.onPageEnd,
        });
    }
    onPageEnd(page) {
        if (page.contents) {
            page.contents = exports.prependYAML(page.contents, this.getYamlItems(page));
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
        return path.basename(page.url, path.extname(page.url));
    }
    getTitle(page) {
        const readmeTitle = this.readmeTitle || page.project.name;
        if (page.url === this.entryDocument && page.url !== page.project.url) {
            return readmeTitle;
        }
        return exports.getPageTitle(page);
    }
};
__decorate([
    typedoc_1.BindOption('out')
], FrontMatterComponent.prototype, "out", void 0);
__decorate([
    typedoc_1.BindOption('sidebar')
], FrontMatterComponent.prototype, "sidebar", void 0);
__decorate([
    typedoc_1.BindOption('globalsTitle')
], FrontMatterComponent.prototype, "globalsTitle", void 0);
__decorate([
    typedoc_1.BindOption('readmeTitle')
], FrontMatterComponent.prototype, "readmeTitle", void 0);
__decorate([
    typedoc_1.BindOption('entryDocument')
], FrontMatterComponent.prototype, "entryDocument", void 0);
FrontMatterComponent = __decorate([
    components_1.Component({ name: 'front-matter' })
], FrontMatterComponent);
exports.FrontMatterComponent = FrontMatterComponent;
