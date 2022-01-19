import * as path from 'path';

// @ts-ignore
import { BindOption } from 'typedoc';
// @ts-ignore
import { Component } from 'typedoc/dist/lib/converter/components';
// @ts-ignore
import { RendererComponent } from 'typedoc/dist/lib/output/components';
// @ts-ignore
import { PageEvent } from 'typedoc/dist/lib/output/events';

import { FrontMatter } from './types';

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
    let items: FrontMatter = {
      title: pageTitle,
    };

    return {
      ...items,
      custom_edit_url: null,
      hide_title: true,
    };
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
