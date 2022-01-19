// @ts-ignore
import { Application } from 'typedoc';

import { PluginOptions } from './types';

/**
 * Calls TypeDoc's `convertAndWatch` and force trigger sidebars refresh.
 */
export const convertAndWatch = (app: Application, options: PluginOptions) => {
  app.convertAndWatch(async (project) => {
    await app.generateDocs(project, options.outputDirectory);
  });
};
