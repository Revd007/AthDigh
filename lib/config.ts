export const siteConfig = {
  name: 'Digital Store',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  ogImage: 'https://your-site.com/og.jpg',
  description: 'Your one-stop shop for premium digital products and game top-up services',
  links: {
    twitter: 'https://twitter.com/your-handle',
    github: 'https://github.com/your-repo',
  },
} as const;

export const authConfig = {
  providers: ['google', 'github'] as const,
  callbacks: {
    signIn: '/dashboard',
    signOut: '/',
  },
} as const; 