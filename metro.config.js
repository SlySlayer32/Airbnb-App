const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Windows paths with spaces
config.watchFolders = [path.resolve(__dirname)];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias for @supabase/node-fetch to prevent dynamic import issues
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@supabase/node-fetch': path.resolve(__dirname, 'shims', 'node-fetch.js'),
};

// Fix file watching for Windows paths with spaces
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Handle Windows path issues
      if (req.url && req.url.includes('%20')) {
        req.url = decodeURIComponent(req.url);
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
