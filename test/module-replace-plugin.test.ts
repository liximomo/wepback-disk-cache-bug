import ModuleReplacePlugin from '../src';
import { resolveFixture } from './utils';
import { watchCompiler, getModuleSource } from './helpers/webpack';

describe('module-replace-plugin', () => {
  test('basic', done => {
    const compiler = watchCompiler({
      mode: 'development',
      entry: resolveFixture('basic'),
      plugins: [
        new ModuleReplacePlugin({
          modules: [
            {
              test: /\?_lazy/,
              module: require.resolve('./fixtures/testDummyComponent')
            }
          ]
        })
      ],
      // with this, the second test run will fail
      cache: {
        type: 'filesystem',
        buildDependencies: {
          // This makes all dependencies of this file - build dependencies
          config: [__filename]
          // By default webpack and loaders are build dependencies
        }
      }
    });

    compiler
      .waitForCompile(stats => {
        expect(getModuleSource(stats, /one\.js/)).toMatch(`testDummyComponent`);
        expect(getModuleSource(stats, /two\.js/)).toMatch(`testDummyComponent`);
        expect(getModuleSource(stats, /index\.js/)).toMatchInlineSnapshot(`
          "import(
            /* webpackChunkName:\\"sharedOne\\" */
            './one?_lazy'
          );
          import(
            /* webpackChunkName:\\"sharedTwo\\" */
            './two?_lazy'
          );
          "
        `);

        compiler.forceCompile();
        return ModuleReplacePlugin.restoreModule('./one?_lazy');
      })
      .then(stats => {
        expect(getModuleSource(stats, /one\.js/)).toMatch(`export default 1;`);
        expect(getModuleSource(stats, /two\.js/)).toMatch(`testDummyComponent`);

        compiler.forceCompile();
        return ModuleReplacePlugin.restoreModule('./two?_lazy');
      })
      .then(stats => {
        expect(getModuleSource(stats, /one\.js/)).toMatch(`export default 1;`);
        expect(getModuleSource(stats, /two\.js/)).toMatch(`export default 2;`);
      })
      .end(done);
  });
});
