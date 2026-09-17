export const SITE = {
  name: 'Bouzid Krita',
  role: 'Professionnel du numérique',
  baseline: 'Je développe, j’intègre, je dépanne et j’expérimente.',
  description:
    'Bouzid Krita, professionnel du numérique polyvalent à Lille : développement web (Vue.js, Node.js), support applicatif, intégration, Docker et monitoring.',
  url: 'https://www.bouzidkrita.com',
  github: 'https://github.com/bouboudev',
  linkedin: 'https://fr.linkedin.com/in/bouzidkrita',
  email: 'contact@bouzidkrita.com',
  location: 'Lille, France',
  locale: 'fr',
} as const;

export const NAV_LINKS = [
  { label: 'Projets', href: '/projets/' },
  { label: 'Parcours', href: '/parcours/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'À propos', href: '/a-propos/' },
  { label: 'Contact', href: '/contact/' },
] as const;
