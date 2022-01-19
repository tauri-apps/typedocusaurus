import * as path from 'path';

import {
  // @ts-ignore
  Application,
  // @ts-ignore
  MixedDeclarationOption,
  // @ts-ignore
  ParameterType,
  // @ts-ignore
  StringDeclarationOption,
  // @ts-ignore
  TSConfigReader,
  // @ts-ignore
  TypeDocReader,
  // @ts-ignore
} from 'typedoc';

import { PluginOptions } from './types';

/**
 * Default plugin options
 */
const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
  id: 'default',
  docsRoot: 'docs',
  out: 'api',
  entryDocument: 'index.md',
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: ['none'],
  outputDirectory: '',
  siteDir: '',
  watch: false,
};

/**
 * Merge default with user options
 * @param opts
 */
export const getOptions = (
  siteDir: string,
  opts: Partial<PluginOptions>,
): PluginOptions => {
  // base options
  let options = {
    ...DEFAULT_PLUGIN_OPTIONS,
    ...opts,
  };
  // additional
  options = {
    ...options,
    siteDir,
    outputDirectory: path.resolve(siteDir, options.docsRoot, options.out),
  };
  return options;
};

/**
 * Add docusaurus options to converter
 * @param app
 */
export const addOptions = (app: Application) => {
  // configure deault typedoc options
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());

  // expose plugin options to typedoc so we can access if required
  app.options.addDeclaration({
    name: 'id',
  } as StringDeclarationOption);

  app.options.addDeclaration({
    name: 'docsRoot',
  } as StringDeclarationOption);

  app.options.addDeclaration({
    name: 'siteDir',
  } as MixedDeclarationOption);

  app.options.addDeclaration({
    name: 'outputDirectory',
  } as StringDeclarationOption);

  app.options.addDeclaration({
    name: 'globalsTitle',
  } as StringDeclarationOption);

  app.options.addDeclaration({
    name: 'readmeTitle',
  } as StringDeclarationOption);
};
