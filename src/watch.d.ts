import { Application } from 'typedoc';
import { PluginOptions } from './types';
/**
 * Calls TypeDoc's `convertAndWatch` and force trigger sidebars refresh.
 */
export declare const convertAndWatch: (app: Application, options: PluginOptions) => void;
