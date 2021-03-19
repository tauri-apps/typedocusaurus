import { RendererComponent } from 'typedoc/dist/lib/output/components';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { SidebarItem, SidebarOptions } from './types';
export declare class SidebarComponent extends RendererComponent {
    sidebar: SidebarOptions;
    siteDir: string;
    out: string;
    initialize(): void;
    onRendererBegin(renderer: RendererEvent): Promise<void>;
    /**
     * returns a sidebar category node
     */
    getSidebarCategory(title: string, items: SidebarItem[]): {
        type: string;
        label: string;
        items: SidebarItem[];
    };
    /**
     * returns the url key for relevant doc
     */
    getUrlKey(out: string, url: string): string;
}
/**
 * Write content to sidebar file
 */
export declare const writeSidebar: (sidebar: SidebarOptions, content: string) => void;
