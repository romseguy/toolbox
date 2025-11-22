const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require("next/constants");

//const withPWA = require("next-pwa")({ dest: "public", reloadOnOnline: false });
let plugins = [];

const nextConfig = {
  i18n: {
    locales: ["default", "en", "fr"],
    defaultLocale: "default",
    localeDetection: true
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = (phase, defaultConfig) => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    //plugins.unshift(withPWA);
  } else if (phase === PHASE_DEVELOPMENT_SERVER) {
    //plugins.unshift(withPWA);
  }

  // if (process.env.ANALYZE) {
  //   const withBundleAnalyzer = require("@next/bundle-analyzer")({
  //     enabled: true
  //   });
  //   plugins.unshift(withBundleAnalyzer);
  // }

  const config = plugins.reduce(
    (acc, plugin) => {
      const update = plugin(acc);
      return typeof update === "function"
        ? update(phase, defaultConfig)
        : update;
    },
    { ...nextConfig }
  );

  return config;
};
