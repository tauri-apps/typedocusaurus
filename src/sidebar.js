"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSidebar = exports.SidebarComponent = void 0;
const fs = require("fs");
const path = require("path");
const typedoc_1 = require("typedoc");
const components_1 = require("typedoc/dist/lib/converter/components");
const components_2 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const promises_1 = require("fs/promises");
let SidebarComponent = class SidebarComponent extends components_2.RendererComponent {
    initialize() {
        this.listenTo(this.application.renderer, {
            [events_1.RendererEvent.BEGIN]: this.onRendererBegin,
        });
    }
    async onRendererBegin(renderer) {
        var _a;
        const navigation = (_a = this.application.renderer.theme) === null || _a === void 0 ? void 0 : _a.getNavigation(renderer.project);
        const out = this.out.match(/(?:.*)en\/(.*)/)[1];
        // map the navigation object to a Docuaurus sidebar format
        const sidebarItems = (navigation === null || navigation === void 0 ? void 0 : navigation.children) ? navigation.children.map((navigationItem) => {
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
        const sidebarContent = JSON.parse(await promises_1.readFile(sidebarPath, "utf-8"));
        const index = sidebarContent.docs[3].items
            .map((row, index) => (row.label && row.label === "JavaScript" ? index : 0))
            .reduce((accumulator, value) => accumulator + value);
        sidebarContent.docs[3].items[index].items = sidebarItems; // Specify where to put the items
        promises_1.writeFile(sidebarPath, JSON.stringify(sidebarContent, null, 2));
        this.application.logger.success(`TypeDoc sidebar written to ${sidebarPath}`);
    }
    /**
     * returns a sidebar category node
     */
    getSidebarCategory(title, items) {
        return {
            type: 'category',
            label: title,
            items,
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
__decorate([
    typedoc_1.BindOption('sidebar')
], SidebarComponent.prototype, "sidebar", void 0);
__decorate([
    typedoc_1.BindOption('siteDir')
], SidebarComponent.prototype, "siteDir", void 0);
__decorate([
    typedoc_1.BindOption('out')
], SidebarComponent.prototype, "out", void 0);
SidebarComponent = __decorate([
    components_1.Component({ name: 'sidebar' })
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
/**
 * Write content to sidebar file
 */
const writeSidebar = (sidebar, content) => {
    if (!fs.existsSync(path.dirname(sidebar.sidebarPath))) {
        fs.mkdirSync(path.dirname(sidebar.sidebarPath));
    }
    fs.writeFileSync(sidebar.sidebarPath, content);
};
exports.writeSidebar = writeSidebar;
