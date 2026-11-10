/** Header, footer and legal navigation. Paths are internal route paths (no trailing slash). */
export interface NavLink {
  label: string;
  to: string;
}

export const mainNav: (NavLink & { mega?: 'services' })[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', mega: 'services' },
  { label: 'How We Work', to: '/how-we-work' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

export const quickLinks: NavLink[] = [
  { label: 'About Us', to: '/about' },
  { label: 'How We Work', to: '/how-we-work' },
  { label: 'Why Choose Us', to: '/why-choose-us' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Resources', to: '/resources' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/contact' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms-and-conditions' },
  { label: 'Refund', to: '/refund-cancellation-policy' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Sitemap', to: '/sitemap' },
];

export const BOOK_PATH = '/book-consultation';
