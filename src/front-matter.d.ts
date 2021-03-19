import { RendererComponent } from 'typedoc/dist/lib/output/components';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { Sidebar } from './types';
export interface FrontMatterVars {
    [key: string]: string | number | boolean;
}
/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export declare const prependYAML: (contents: string, vars: FrontMatterVars) => string;
/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
export declare const getPageTitle: (page: PageEvent) => any;
export declare class FrontMatterComponent extends RendererComponent {
    out: string;
    sidebar: Sidebar;
    globalsTitle: string;
    readmeTitle: string;
    entryDocument: string;
    globalsFile: string;
    initialize(): void;
    onPageEnd(page: PageEvent): void;
    getYamlItems(page: PageEvent): any;
    getSidebarLabel(page: PageEvent): any;
    getId(page: PageEvent): string;
    getTitle(page: PageEvent): any;
}
