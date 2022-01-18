import * as path from 'path';

// @ts-ignore
import { BindOption } from 'typedoc';
// @ts-ignore
import { Component } from 'typedoc/dist/lib/converter/components';
// @ts-ignore
import { RendererComponent } from 'typedoc/dist/lib/output/components';
// @ts-ignore
import { PageEvent } from 'typedoc/dist/lib/output/events';

import { FrontMatter, Sidebar } from './types';

// @ts-ignore
import { reflectionTitle } from 'typedoc-plugin-markdown/dist/resources/helpers/reflection-title';

export interface FrontMatterVars {
  [key: string]: string | number | boolean;
}

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export const prependYAML = (contents: string, vars: FrontMatterVars) => {
  return contents
    .replace(/^/, toYAML(vars) + '\n\n')
    .replace(/[\r\n]{3,}/g, '\n\n');
};

/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
export const getPageTitle = (page: PageEvent) => {
  return reflectionTitle.call(page, false);
};

/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars: FrontMatterVars) => {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === 'string' ? `"${escapeString(value)}"` : value
      }`,
  )
  .join('\n')}
---`;
  return yaml;
};

// prettier-ignore
const escapeString=(str: string) => str.replace(/([^\\])'/g, '$1\\\'');

@Component({ name: 'front-matter' })
export class FrontMatterComponent extends RendererComponent {
  @BindOption('out')
  out!: string;
  @BindOption('sidebar')
  sidebar!: Sidebar;
  @BindOption('globalsTitle')
  globalsTitle!: string;
  @BindOption('readmeTitle')
  readmeTitle!: string;
  @BindOption('entryDocument')
  entryDocument!: string;

  globalsFile = 'modules.md';

  initialize() {
    super.initialize();
    // @ts-ignore
    this.listenTo(this.application.renderer, {
      [PageEvent.END]: this.onPageEnd,
    });
  }
  onPageEnd(page: PageEvent) {
    if (page.contents) {
      page.contents = prependYAML(page.contents, this.getYamlItems(page));
    }
  }

  getYamlItems(page: PageEvent): any {
    const pageTitle = this.getTitle(page);
    const sidebarLabel = this.getSidebarLabel(page);
    let items: FrontMatter = {
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

  getSidebarLabel(page: PageEvent) {
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

  getId(page: PageEvent) {
    return path.basename(page.url, path.extname(page.url));
  }

  getTitle(page: PageEvent) {
    const readmeTitle = this.readmeTitle || page.project.name;
    if (page.url === this.entryDocument && page.url !== page.project.url) {
      return readmeTitle;
    }
    return getPageTitle(page);
  }
}
