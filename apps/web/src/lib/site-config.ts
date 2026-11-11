export const siteConfig = {
  name: 'Lee Robinson',
  handle: '@leerob',
  email: 'lee@leerob.com',
  url: 'https://leerob.com',
  description: 'Developer and writer.',
  avatar: '/avatar.webp',
  socials: {
    x: 'https://x.com/leerob',
    github: 'https://github.com/leerob',
    youtube: 'https://www.youtube.com/@leerob',
    linkedin: 'https://www.linkedin.com/in/leeerob',
  },
  jobTitle: 'Engineer and writer',
  alumniOf: 'Iowa State University',
  credit: {
    text: 'Inspired by',
    handle: '@leerob',
    href: 'https://x.com/leerob',
    suffix: 'on X',
  },
} as const;

export type SiteConfig = typeof siteConfig;
