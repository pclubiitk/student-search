const swBuild = require('workbox-build');

swBuild.generateSW({
  navigateFallback: 'index.html',
  globDirectory: './dist',
  globPatterns: [
    'index.html',
    'robots.txt',
    '**.js',
    '**.css'
  ],
  swDest: 'dist/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /\/api\/students\//,
      handler: 'networkFirst',
      options: {
        cacheName: 'api-cache',
        cacheExpiration: {
          maxEntries: 10
        }
      }
    }
  ]
}).then(() => console.log('Service Worker generated')).catch(err => console.error(err, 'Service Worker failed to generate'));
