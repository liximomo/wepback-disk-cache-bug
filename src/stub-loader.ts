import { loader } from 'webpack';
import loaderUtils from 'loader-utils';

export default function stubLoader(this: loader.LoaderContext) {
  const { module }: any = loaderUtils.getOptions(this) || {};
  const sModule = JSON.stringify(module);
  this.cacheable(false);

  return `
module.exports = require(${sModule})
`.trim();
}
