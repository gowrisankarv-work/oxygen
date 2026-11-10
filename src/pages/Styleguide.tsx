/** Dev-only design system reference (/styleguide). Excluded from production builds. */
import { Section, SectionHeading, Card, Badge, SampleLabel } from '@/components/ui/Layout';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input, Select, Textarea, Checkbox } from '@/components/ui/Field';
import { Accordion } from '@/components/ui/Accordion';
import { Tabs } from '@/components/ui/Tabs';
import { Icon, iconNames } from '@/components/icons/Icon';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { useToast } from '@/components/ui/Toast';
import { useEnquiry } from '@/components/forms/EnquiryModal';

const swatches = [
  ['purple-900', 'bg-purple-900', '#2A0A52'],
  ['purple-700', 'bg-purple-700', '#52017F'],
  ['purple-500', 'bg-purple-500', '#6D28D9'],
  ['violet-400', 'bg-violet-400', '#8B5CF6'],
  ['magenta-500', 'bg-magenta-500', '#D61F8C'],
  ['trust-600 (red)', 'bg-trust-600', '#DC3940'],
  ['navy-800', 'bg-navy-800', '#13245A'],
  ['blue-600', 'bg-blue-600', '#2F5BD3'],
  ['gold-400', 'bg-gold-400', '#F4B915'],
  ['surface (neutral-50)', 'bg-surface', '#F8F7FC'],
  ['line (neutral-100)', 'bg-line', '#EFEDF7'],
  ['muted (neutral-500)', 'bg-muted', '#6B6880'],
  ['ink (neutral-900)', 'bg-ink', '#17142B'],
  ['error-600', 'bg-error-600', '#B42318'],
] as const;

export default function Styleguide() {
  const toast = useToast();
  const enquiry = useEnquiry();
  return (
    <>
      <section className="bg-surface pt-[calc(var(--header-h)+var(--topbar-h)+3rem)] pb-12">
        <div className="container-site">
          <p className="eyebrow text-purple-500">Development only · noindex</p>
          <h1 className="mt-2 text-h1">Styleguide</h1>
        </div>
      </section>
      <Section>
        <SectionHeading title="Logo" />
        <div className="flex flex-wrap items-center gap-10">
          <BrandLogo size={48} />
          <BrandLogo variant="wordmark" size={48} />
          <BrandLogo variant="emblem" size={64} />
          <div className="rounded-card bg-purple-900 p-6">
            <BrandLogo theme="dark" size={48} />
          </div>
        </div>
      </Section>
      <Section tone="surface">
        <SectionHeading title="Colour tokens" />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map(([name, cls, hex]) => (
            <li key={name} className="overflow-hidden rounded-xl border border-line bg-white">
              <span className={`block h-16 ${cls}`} />
              <span className="block p-2 text-xs">
                <strong className="block">{name}</strong>
                {hex}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-16 rounded-xl bg-signature" />
        <p className="mt-2 text-small text-muted">Signature gradient (decorative only)</p>
      </Section>
      <Section>
        <SectionHeading title="Typography" />
        <p className="text-display font-display font-bold text-purple-900">Display 40→72</p>
        <p className="text-h1 font-display font-bold text-purple-900">Heading 1 36→56</p>
        <p className="text-h2 font-display font-bold text-purple-900">Heading 2 28→40</p>
        <p className="text-h3 font-display font-bold text-purple-900">Heading 3 20→26</p>
        <p className="text-body">Body 16→18 — The quick brown fox jumps over the lazy dog.</p>
        <p className="text-small text-muted">Small 14 — supporting text.</p>
        <p className="eyebrow mt-2 text-purple-500">Eyebrow label</p>
      </Section>
      <Section tone="surface">
        <SectionHeading title="Buttons & badges" />
        <div className="flex flex-wrap gap-3">
          <Button arrow>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="whatsapp" icon="whatsapp">
            WhatsApp
          </Button>
          <Button variant="gold">Gold</Button>
          <Button disabled>Disabled</Button>
          <ButtonLink to="/contact" variant="secondary" arrow>
            Link button
          </ButtonLink>
          <Button
            variant="secondary"
            onClick={() => toast.show({ title: 'Toast example', description: 'This is a toast.' })}
          >
            Show toast
          </Button>
          <Button variant="secondary" onClick={() => enquiry.open('publication-services')}>
            Open enquiry modal
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Purple</Badge>
          <Badge tone="gold">Gold</Badge>
          <Badge tone="trust">Trust</Badge>
          <SampleLabel />
        </div>
      </Section>
      <Section>
        <SectionHeading title="Cards, fields, accordion, tabs" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Card interactive>
            <h3 className="text-h3">Interactive card</h3>
            <p className="mt-2 text-muted">Hover to see lift, border and shadow.</p>
          </Card>
          <div className="space-y-4">
            <Input label="Text input" name="sg-text" required />
            <Input label="With error" name="sg-err" error="This field has an error." />
            <Select
              label="Select"
              name="sg-select"
              options={[{ value: 'a', label: 'Option A' }]}
              placeholder="Choose"
            />
            <Textarea label="Textarea" name="sg-ta" />
            <Checkbox name="sg-cb" label="Checkbox label" />
          </div>
          <Accordion items={[{ id: 'sg-1', title: 'Accordion item', content: <p>Content</p> }]} />
          <Tabs
            label="Example tabs"
            items={[
              { id: 'one', label: 'One', content: <p>Panel one</p> },
              { id: 'two', label: 'Two', content: <p>Panel two</p> },
            ]}
          />
        </div>
      </Section>
      <Section tone="surface">
        <SectionHeading title={`Icons (${iconNames.length})`} />
        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12">
          {iconNames.map((n) => (
            <li
              key={n}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center text-[0.65rem] text-muted"
            >
              <Icon name={n} className="text-purple-700" />
              {n}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
