/**
 * Home hero — split layout: copy (left) and an illustrated composition with floating glass
 * cards (right). Headline reveals word by word (CSS, disabled under reduced motion).
 */
import { siteConfig } from '@/config/site.config';
import { images } from '@/config/images';
import { BOOK_PATH } from '@/content/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { ShieldList } from '@/components/ui/ShieldList';
import { Img } from '@/components/ui/Img';
import { Icon, type IconName } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

const floatingCards: { label: string; sub: string; icon: IconName; className: string; delay: string }[] = [
  {
    label: 'Application Review',
    sub: 'Checked & ready ✓',
    icon: 'file-check',
    className: 'top-[8%] -left-2 sm:-left-8',
    delay: 'motion-safe:animate-float',
  },
  {
    label: 'Career Roadmap',
    sub: '3 paths mapped',
    icon: 'route',
    className: 'top-[46%] -right-2 sm:-right-6',
    delay: 'motion-safe:animate-float-slow',
  },
  {
    label: 'Manuscript Ready',
    sub: 'Formatted to guidelines',
    icon: 'book-open',
    className: 'bottom-[6%] left-[6%]',
    delay: 'motion-safe:animate-float',
  },
];

export function Hero() {
  const words = siteConfig.tagline.split(' ');
  const splitAt = Math.max(1, words.length - 2); // last two words get the gradient
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-white pt-[calc(var(--header-h)+var(--topbar-h)+2rem)] pb-16 lg:pt-[calc(var(--header-h)+var(--topbar-h)+3.5rem)] lg:pb-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_85%_10%,rgb(139_92_246/0.14),transparent_60%),radial-gradient(40rem_30rem_at_0%_100%,rgb(214_31_140/0.08),transparent_60%)]" />
        <div className="pattern-slash absolute inset-y-0 right-0 w-3/5 text-purple-700 opacity-[0.045]" />
      </div>

      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <p className="eyebrow mb-5 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-surface px-4 py-2 text-purple-700 ring-1 ring-purple-700/10">
            Admissions · Careers · Research · Publications
          </p>
          <h1 id="hero-title" className="text-display tracking-[-0.03em] text-purple-900">
            {words.map((w, i) => (
              <span key={i}>
                <span className={cn('hero-word', i >= splitAt && 'text-gradient')} style={{ '--i': i }}>
                  {w}
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted lg:text-[1.15rem]">
            Honest, expert guidance for admissions, career choices, research and publication — personalised to you, and
            always done the right way.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={BOOK_PATH} size="lg" arrow className="w-full sm:w-auto">
              Book a Free Consultation
            </ButtonLink>
            <ButtonLink to="/services" size="lg" variant="secondary" className="w-full sm:w-auto">
              Explore Our Services
            </ButtonLink>
          </div>
          <ShieldList
            compact
            className="mt-8 grid gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:space-y-0"
            items={['Personalised 1:1 guidance', 'Ethical & transparent', 'End-to-end support']}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-[4%] -z-10 bg-signature opacity-90 motion-safe:animate-blob"
            style={{ borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%' }}
          />
          <div aria-hidden="true" className="absolute -inset-6 -z-20 rounded-full bg-violet-400/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white/70 shadow-lift">
            <Img asset={images.hero} priority className="block w-full" />
          </div>
          {floatingCards.map((c) => (
            <div
              key={c.label}
              aria-hidden="true"
              className={cn(
                'absolute flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 px-3.5 py-2.5 shadow-soft backdrop-blur-md sm:px-4 sm:py-3',
                c.className,
                c.delay,
              )}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-signature text-white">
                <Icon name={c.icon} size={18} />
              </span>
              <span className="leading-tight">
                <span className="block text-small font-semibold text-purple-900">{c.label}</span>
                <span className="block text-xs text-muted">{c.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
