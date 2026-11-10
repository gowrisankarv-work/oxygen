import { siteConfig } from '@/config/site.config';
import { telHref, mailtoHref } from '@/lib/phone';
import { socialLinks } from '@/lib/social';
import { Icon } from '@/components/icons/Icon';

/** Slim desktop-only utility bar (phone, email, hours, socials). */
export function TopBar() {
  const { contact } = siteConfig;
  const weekday = contact.hours[0];
  const socials = socialLinks();
  return (
    <div className="on-dark hidden h-[var(--topbar-h)] bg-purple-900 text-small text-white/85 lg:block">
      <div className="container-site flex h-full items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          <li>
            <a href={telHref(contact.phone)} className="inline-flex items-center gap-2 hover:text-white">
              <Icon name="phone" size={15} className="text-gold-400" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={mailtoHref(contact.email)} className="inline-flex items-center gap-2 hover:text-white">
              <Icon name="mail" size={15} className="text-gold-400" />
              {contact.email}
            </a>
          </li>
          {weekday && (
            <li className="inline-flex items-center gap-2">
              <Icon name="clock" size={15} className="text-gold-400" />
              {weekday.label}: {weekday.time}
            </li>
          )}
        </ul>
        {socials.length > 0 && (
          <ul className="flex items-center gap-1" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-8 place-items-center rounded-full hover:bg-white/10 hover:text-white"
                  aria-label={`${siteConfig.shortName} on ${s.name} (opens in a new tab)`}
                >
                  <Icon name={s.icon} size={16} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
