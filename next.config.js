const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */

module.exports = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  i18n,
  output: 'standalone',
  webpack: (config, { webpack, isServer }) => {
    if (isServer) {
      // Module not found
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^snappy$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        })
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
  rewrites: async () => {
    return [
      {
        source: '/.well-known/saml.cer',
        destination: '/api/well-known/saml.cer',
      },
      {
        source: '/.well-known/openid-configuration',
        destination: '/api/well-known/openid-configuration',
      },
      {
        source: '/.well-known/sp-metadata',
        destination: '/api/well-known/sp-metadata',
      },
      {
        source: '/.well-known/idp-metadata',
        destination: '/api/well-known/idp-metadata',
      },
      {
        source: '/.well-known/saml-configuration',
        destination: '/well-known/saml-configuration',
      },
      {
        source: '/.well-known/idp-configuration',
        destination: '/well-known/idp-configuration',
      },
      {
        source: '/oauth/jwks',
        destination: '/api/oauth/jwks',
      },
      {
        source: '/admin/directory-sync/setup-link',
        destination: '/admin/setup-link',
      },
      {
        source: '/admin/sso-connection/setup-link',
        destination: '/admin/setup-link',
      },
      {
        source: '/admin/sso-connection/setup-link/new',
        destination: '/admin/setup-link/new',
      },
      {
        source: '/admin/directory-sync/setup-link/new',
        destination: '/admin/setup-link/new',
      },
      {
        source: '/.well-known',
        destination: '/well-known',
      },
      {
        source: '/admin/settings',
        destination: '/admin/settings/sso-connection',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};
