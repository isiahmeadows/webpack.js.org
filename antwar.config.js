const path = require('path');
const _ = require('lodash');
const prevnextPlugin = require('antwar-prevnext-plugin');

module.exports = {
  maximumWorkers: process.env.TRAVIS && 1, // Faster on Travis
  template: {
    title: 'webpack',
    description: 'webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.',
    file: path.join(__dirname, 'template.ejs')
  },
  output: 'build',
  title: 'webpack',
  keywords: ['webpack', 'javascript', 'web development', 'programming'],

  // XXXXX: restore
  pageTitle: function(config, pageTitle) {
    var siteName = config.name;

    if (pageTitle === 'index') {
      return siteName;
    }

    return siteName + ' - ' + pageTitle;
  },
  plugins: [
    prevnextPlugin()
  ],
  layout: function() {
    return require('./components/site/site.jsx').default
  },
  paths: {
    '/': {
      content: () => (
        require.context(
          './loaders/page-loader!./content',
          true,
          /^\.\/.*\.md$/
        )
      ),
      layouts: {
        index: () => require('./components/page/page.jsx').default,
        page: () => require('./components/page/page.jsx').default
      },
      custom: () => require('./components/splash/splash.jsx').default,
      paths: {
        'get-started': {
          redirects: {
            '': '/guides/get-started',
            'install-webpack': '/guides/installation',
            'why-webpack': '/guides/why-webpack',
          }
        },
        guides: {
          redirects: {
            'code-splitting-import': '/guides/code-splitting-async',
            'code-splitting-require': '/guides/code-splitting-async/#require-ensure-',
            'why-webpack': '/guides/comparison'
          }
        },
        configuration: {
          redirects: {
            'external-configs': 'javascript-alternatives'
          }
        },
        api: {
          redirects: {
            'passing-a-config': 'configuration-types'
          }
        },
        pluginsapi: {
          redirects: {
            '': '/api/plugins',
            'compiler': '/api/plugins/compiler',
            'template': '/api/plugins/template'
          }
        },
        loaders: {
          content: () => {
            const content = require.context(
              './loaders/page-loader!./content/loaders',
              false,
              /^\.\/.*\.md$/
            );
            const generated = require.context(
              './loaders/page-loader!./generated/loaders',
              false,
              /^\.\/.*\.md$/
            );

            return combineContexts(content, generated);
          }
        },
        loaders: {
          content: () => {
            const content = require.context(
              './loaders/page-loader!./content/plugins',
              false,
              /^\.\/.*\.md$/
            );
            const generated = require.context(
              './loaders/page-loader!./generated/plugins',
              false,
              /^\.\/.*\.md$/
            );

            return combineContexts(content, generated);
          }
        }
      }
    },
    vote: {
      custom: () => require('./components/vote/list.jsx').default
    },
    'vote/feedback': {
      custom: () => require('./components/vote/list.jsx').default
    },
    'vote/moneyDistribution': {
      custom: () => require('./components/vote/list.jsx').default
    },
    organization: {
      custom: () => require('./components/organization/organization.jsx').default
    }
  }
};

function combineContexts(context1, context2) {
  function webpackContext(req) {
    try {
      return context1(req);
    } catch (e) {
      return context2(req);
    }
  }
  webpackContext.keys = () => {
    let keys1 = context1.keys();
    let keys2 = context2.keys();
    return _.chain(keys1).concat(keys2).sortBy().uniq().value();
  };
  return webpackContext;
}
