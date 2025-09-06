/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-site-url.com', // Change this to your production URL
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/', // Allow all pages to be crawled
      },
    ],
  },
  // Exclude admin and API routes
  exclude: ['/admin/*', '/api/*'],
  // Change frequency and priority for specific pages
  changefreq: 'daily',
  priority: 0.7,
  // Additional sitemap configurations
  sitemapSize: 5000,
  // Add any additional paths that should be included in the sitemap
  additionalPaths: async (config) => {
    const result = []
    // Add dynamic paths here if needed
    return result
  },
}
