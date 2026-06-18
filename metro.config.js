const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// libsodium-wrappers has an `exports.import` that points to the ESM build.
// Metro resolves it via package exports but cannot bundle .mjs sibling files.
// Force the CJS build using path.resolve to bypass the exports field check.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'libsodium-wrappers') {
    return {
      filePath: path.resolve(
        __dirname,
        'node_modules/libsodium-wrappers/dist/modules/libsodium-wrappers.js',
      ),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
