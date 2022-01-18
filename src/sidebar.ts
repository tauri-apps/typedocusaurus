import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import { BindOption } from 'typedoc';
// @ts-ignore
import { Component } from 'typedoc/dist/lib/converter/components';
// @ts-ignore
import { RendererComponent } from 'typedoc/dist/lib/output/components';
// @ts-ignore
import { RendererEvent } from 'typedoc/dist/lib/output/events';

import { SidebarItem, SidebarOptions } from './types';

@Component({ name: 'sidebar' })
export class SidebarComponent extends RendererComponent {
  @BindOption('sidebar')
  sidebar!: SidebarOptions;
  @BindOption('siteDir')
  siteDir!: string;
  @BindOption('out')
  out!: string;

  initialize() {
    // @ts-ignore
    this.listenTo(this.application.renderer, {
      [RendererEvent.BEGIN]: this.onRendererBegin,
    });
  }

  async onRendererBegin(renderer: RendererEvent) {
    // @ts-ignore
    const navigation = this.application.renderer.theme?.getNavigation(
      renderer.project,
    );

    const out = this.out.match(/(?:.*)en\/(.*)/)![1];

    // map the navigation object to a Docuaurus sidebar format
    const sidebarItems = navigation?.children
      ? navigation.children.map((navigationItem) => {
          if (navigationItem.isLabel) {
            const sidebarCategoryItems = navigationItem.children
              ? navigationItem.children.map((navItem) => {
                  const url = this.getUrlKey(out, navItem.url);
                  if (navItem.children && navItem.children.length > 0) {
                    const sidebarCategoryChildren = navItem.children.map(
                      (childGroup) =>
                        this.getSidebarCategory(
                          childGroup.title,
                          childGroup.children
                            ? childGroup.children.map((childItem) =>
                                this.getUrlKey(out, childItem.url),
                              )
                            : [],
                        ),
                    );
                    return this.getSidebarCategory(navItem.title, [
                      url,
                      ...sidebarCategoryChildren,
                    ]);
                  }
                  return url;
                })
              : [];
            return this.getSidebarCategory(
              navigationItem.title,
              sidebarCategoryItems,
            );
          }
          return this.getUrlKey(out, navigationItem.url);
        })
      : [];

    const sidebarPath = this.sidebar.sidebarPath;

    fs.writeFileSync(sidebarPath, JSON.stringify(sidebarItems, null, 2));
    // @ts-ignore
    this.application.logger.success(
      `TypeDoc sidebar written to ${sidebarPath}`,
    );
  }

  /**
   * returns a sidebar category node
   */
  getSidebarCategory(title: string, items: SidebarItem[]) {
    return {
      items,
      type: 'category',
      label: title,
    };
  }

  /**
   * returns the url key for relevant doc
   */
  getUrlKey(out: string, url: string) {
    const urlKey = url.replace('.md', '');
    return out ? out + '/' + urlKey : urlKey;
  }
}

/**
 * Write content to sidebar file
 */
export const writeSidebar = (sidebar: SidebarOptions, content: string) => {
  if (!fs.existsSync(path.dirname(sidebar.sidebarPath))) {
    fs.mkdirSync(path.dirname(sidebar.sidebarPath));
  }
  fs.writeFileSync(sidebar.sidebarPath, content);
};
