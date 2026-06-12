import type { Content } from './content.ar';

/**
 * English content tree — same shape as `content.ar.ts`. Voice is
 * restrained luxury (no corporate clichés, no exclamation marks);
 * matches the Arabic register where it talks about heritage, scale,
 * and craft. Defaults to UK/UAE spelling where they differ (e.g.
 * "decor" stays as decor).
 */
export const content: Content = {
  hero: {
    wordmark: 'PETRAVEX',
    title: 'From stone, we build the future.',
    subtitle: 'Multiple companies. One purpose.',
    scrollHint: 'Scroll',
  },
  entryCards: {
    buyer: {
      title: 'I am a buyer',
      description: 'Browse our products and building materials',
      cta: 'Explore products',
      href: '/products',
    },
    supplier: {
      title: 'I am a supplier',
      description: 'Join our supplier network',
      cta: 'Submit a proposal',
      href: '/suppliers',
    },
    career: {
      title: 'I am looking for work',
      description: 'Find open roles across the group',
      cta: 'Open positions',
      href: '/careers',
    },
  },
  divisions: {
    sectionTitle: 'Multiple companies. One value chain.',
    sectionSubtitle: 'From stone to skyline',
    cta: 'Explore the group',
    detailsCta: 'Details',
    items: [
      { name: 'Trading', location: 'Dubai', href: '/group/trading', key: 'trading' },
      { name: 'Contracting', location: 'Dubai', href: '/group/contracting', key: 'contracting' },
      { name: 'Decor', location: 'Dubai', href: '/group/decor', key: 'decor' },
      { name: 'Fit-out', location: 'Dubai', href: '/group/fit-out', key: 'fit-out' },
      { name: 'Import & Export', location: 'Dubai', href: '/group/import-export', key: 'import-export' },
      { name: 'Transport', location: 'UAE', href: '/group/transport', key: 'transport' },
      { name: 'Clinker Grinding', location: 'RAKEZ', href: '/group/cement', key: 'cement' },
    ],
  },
  story: {
    sectionTitle: 'From stone to skyline',
    steps: [
      {
        num: '1',
        title: 'Material',
        desc: 'Raw material, carefully sourced',
        story:
          'Every skyline starts with a stone. We choose the sources, test the samples, and reject anything that doesn’t deserve to anchor a project.',
      },
      {
        num: '2',
        title: 'Clinker',
        desc: 'Clinker grinding in RAKEZ',
        story:
          'In kilns above 1,450°C, stone becomes clinker — the core of cement. The quality of every future mix is decided here.',
      },
      {
        num: '3',
        title: 'Cement',
        desc: 'Produced to GCC specifications',
        story:
          'Clinker is ground with gypsum in measured ratios — cement that meets GCC specifications and carries our name on every bag.',
      },
      {
        num: '4',
        title: 'Trading',
        desc: 'Distribution across Dubai and the UAE',
        story:
          'A logistics fleet connects the plant to the site. From port to project, every ton arrives on time, without delay.',
      },
      {
        num: '5',
        title: 'Building',
        desc: 'Construction and decor delivery',
        story:
          'We close the loop where it began — on the horizon. Construction projects and decor touches that leave a lasting mark.',
      },
    ],
  },
  stats: {
    items: [
      { number: 4, suffix: '', label: 'Group companies' },
      { number: 3, suffix: '', label: 'Locations' },
      { number: 20, suffix: '+', label: 'Years of experience' },
      { number: 100, suffix: '%', label: 'Emirati-owned' },
    ],
  },
  dualCta: {
    supplier: {
      title: 'Become a supplier',
      desc: 'We work with trusted suppliers across materials, equipment, and services',
      cta: 'Join now',
      href: '/suppliers',
    },
    buyer: {
      title: 'Become a buyer',
      desc: 'A full catalogue of cement, building materials, and decor',
      cta: 'Explore products',
      href: '/products',
    },
  },
  news: {
    sectionTitle: 'Latest news',
    cta: 'Read more',
    items: [
      {
        date: 'March 2026',
        title: 'Clinker grinding plant in RAKEZ',
        excerpt: 'A new link in the group’s value chain',
        href: '/news/clinker-mill',
      },
      {
        date: 'February 2026',
        title: 'Distribution network expansion',
        excerpt: 'Strengthening our presence across the UAE and serving contractors with greater efficiency',
        href: '/news/distribution-network-expansion',
      },
      {
        date: 'January 2026',
        title: 'New partnership in the construction sector',
        excerpt: 'A long-term supply agreement with leading Dubai developers',
        href: '/news/new-construction-partnership',
      },
    ],
  },
  footer: {
    description: 'An integrated building-materials group in the UAE',
    locations: {
      title: 'Locations',
      items: ['Dubai — HQ', 'RAKEZ — Grinding plant'],
    },
    group: {
      title: 'The group',
      items: [
        { name: 'Trading', href: '/group/trading' },
        { name: 'Contracting', href: '/group/contracting' },
        { name: 'Decor', href: '/group/decor' },
        { name: 'Fit-out', href: '/group/fit-out' },
        { name: 'Import & Export', href: '/group/import-export' },
        { name: 'Transport', href: '/group/transport' },
        { name: 'Clinker Grinding', href: '/group/cement' },
      ],
    },
    links: {
      title: 'Links',
      items: [
        { name: 'Products', href: '/products' },
        { name: 'Suppliers', href: '/suppliers' },
        { name: 'Careers', href: '/careers' },
        { name: 'News', href: '/news' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    contact: {
      title: 'Contact',
      email: 'info@petravex.com',
      phone: '+971 54 249 4377',
      website: 'www.petravex.com',
    },
    copyright: '© 2026 Petravex Group — All rights reserved',
    privacy: 'Privacy',
  },
  nav: {
    home: 'Home',
    story: 'Our story',
    group: 'The group',
    products: 'Products',
    suppliers: 'Suppliers',
    careers: 'Careers',
    contact: 'Contact',
  },
  placeholders: {
    comingSoon: 'Coming soon',
    news: { eyebrow: 'News', title: 'Latest from the group', description: 'Recent news and announcements from the Petravex companies. The full news page is in preparation.' },
    products: { eyebrow: 'Products', title: 'The Petravex catalogue', description: 'Cement, building materials, and decor — built to GCC specifications. The full catalogue is in preparation.' },
    suppliers: { eyebrow: 'Suppliers', title: 'Join our supplier network', description: 'We work with trusted suppliers across materials, equipment, and services. The full submission form is in preparation.' },
    careers: { eyebrow: 'Careers', title: 'Join the team', description: 'Open positions across the group companies. The full careers page is in preparation.' },
    contact: { eyebrow: 'Contact', title: 'We’re listening', description: 'For procurement, partnerships, and general enquiries. The full contact form is in preparation.' },
    story: { eyebrow: 'Our story', title: 'From stone to skyline', description: 'An integrated value chain from source to site. The full story page is in preparation.' },
    projects: { eyebrow: 'Projects', title: 'Group projects', description: 'A look at the work of Petravex companies across the UAE. The full projects page is in preparation.' },
    sustainability: { eyebrow: 'Sustainability', title: 'Our responsibility to the environment', description: 'Our commitment to environmentally responsible practices across every step of the value chain. The full page is in preparation.' },
    privacy: { eyebrow: 'Privacy', title: 'Privacy policy', description: 'Our privacy and data-protection policy is in preparation.' },
  },
  contactPage: {
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
  },
};
