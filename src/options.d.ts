import { Application } from 'typedoc';
import { PluginOptions } from './types';
/**
 * Merge default with user options
 * @param opts
 */
export declare const getOptions: (siteDir: string, opts: Partial<PluginOptions>) => PluginOptions;
/**
 * Add docusaurus options to converter
 * @param app
 */
export declare const addOptions: (app: Application) => void;
