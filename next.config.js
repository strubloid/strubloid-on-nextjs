const Dotenv = require("dotenv-webpack");

module.exports = {
    // Target must be serverless
    target: "serverless",
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Add the new plugin to the existing webpack plugins
        config.plugins.push(new Dotenv({ silent: true }));

        return config;
    },
    env: {
        REACT_APP_GOOGLE_KEY: process.env.REACT_APP_GOOGLE_KEY,
        MONGO_URI: process.env.MONGO_URI,
    },
};