export interface PluginOptions {
  id: string;
  docsRoot: string;
  out: string;
  readmeTitle?: string;
  globalsTitle?: string;
  plugin: string[];
  readme?: string;
  disableOutputCheck?: boolean;
  entryPoints?: string[];
  entryDocument: string;
  hideInPageTOC: boolean;
  hideBreadcrumbs: boolean;
  siteDir: string;
  outputDirectory: string;
  watch: boolean;
}

export interface FrontMatter {
  id?: string;
  title: string;
  slug?: string;
  hide_title?: boolean;
}