// @ts-ignore
import { Application } from 'typedoc';
// @ts-ignore
import { load } from 'typedoc-plugin-markdown';

import { FrontMatterComponent } from './front-matter';
import { addOptions, getOptions } from './options';
import { render } from './render';
import { SidebarComponent } from './sidebar';
import { PluginOptions } from './types';


export default async function generate(
  siteDir: string,
  opts: Partial<PluginOptions>,
) {
  // we need to generate an empty sidebar up-front so it can be resolved from sidebars.js
  const options = getOptions(siteDir, opts);
  // if (options.sidebar) {
  //   writeSidebar(options.sidebar, 'module.exports=[];');
  // }

  // initialize and build app
  const app = new Application();

  // load the markdown plugin
  load(app);

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
