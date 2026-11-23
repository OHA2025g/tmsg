'use client';

import {useState, type ReactNode, type KeyboardEvent} from 'react';
import {ArrowRight, ArrowUpRight, ChevronRight} from 'lucide-react';
import {process, type Business} from '@/content/site';
import {ShaderField} from './motion/ShaderField';

export function TextLink({href, children}: {href: string; children: ReactNode}) {
  return <a className="quiet-link" href={href}>{children}<ArrowUpRight size={18}/></a>;
}

export function Photo({name, alt, className = '', eager = false}: {name: string; alt: string; className?: string; eager?: boolean}) {
  return <figure className={'page-photo ' + className}><img src={'/images/' + name + '.webp'} alt={alt} width="1600" height="1100" loading={eager ? 'eager' : 'lazy'}/><figcaption>Illustrative photography</figcaption></figure>;
}

export function Breadcrumb({label, business}: {label: string; business?: Business}) {
  return <nav className="page-breadcrumb" aria-label="Breadcrumb"><a href="/">TMSG</a><ChevronRight size={12}/>{business && <><a href={'/' + business.slug}>{business.name}</a><ChevronRight size={12}/></>}<span aria-current="page">{label}</span></nav>;
}

export function PageCover({label, title, description, image, children, business, tone = ''}: {label: string; title: ReactNode; description: string; image: string; children?: ReactNode; business?: Business; tone?: string}) {
  return <section className={'page-cover ' + tone}>
    <ShaderField mood={business?.slug || 'grain'}/>
    <div className="page-cover-copy"><Breadcrumb label={label} business={business}/><p className="eyebrow">{business ? business.name + ' / ' + label : label}</p><h1>{title}</h1><p className="page-cover-description">{description}</p>{children && <div className="page-cover-actions">{children}</div>}</div>
    <Photo name={image} alt={'Illustrative ' + (business ? business.sector.toLowerCase() : label.toLowerCase()) + ' setting'} eager/>
  </section>;
}

export function PageHeading({label, title, description, children}: {label: string; title: ReactNode; description?: string; children?: ReactNode}) {
  return <header className="page-heading"><Breadcrumb label={label}/><div><div><p className="eyebrow">{label}</p><h1>{title}</h1></div><div>{description && <p>{description}</p>}{children}</div></div></header>;
}

export function JumpLinks({items}: {items: [string, string][]}) {
  return <nav className="page-jumps" aria-label="On this page"><span>On this page</span>{items.map(([label, id]) => <a key={id} href={'#' + id}>{label}<ChevronRight size={12}/></a>)}<i className="jump-marker" aria-hidden="true"/></nav>;
}

export function TabSet({items, id, label}: {items: [string, string][]; id: string; label: string}) {
  const [active, setActive] = useState(0);
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    setActive(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }
  return <div className="editorial-tabs"><div role="tablist" aria-label={label}>{items.map(([title], i) => <button key={title} role="tab" type="button" id={id + '-tab-' + i} aria-selected={active === i} aria-controls={id + '-panel-' + i} tabIndex={active === i ? 0 : -1} onKeyDown={e => move(e, i)} onClick={() => setActive(i)}>{title}</button>)}</div>{items.map(([title, text], i) => <div key={title} role="tabpanel" id={id + '-panel-' + i} aria-labelledby={id + '-tab-' + i} hidden={active !== i} tabIndex={0}><h3>{title}</h3><p>{text}</p></div>)}</div>;
}

export function ApproachFeature({business}: {business?: Business}) {
  const items = business?.principles || process;
  const photo = business?.slug === 'zustmed' ? 'healthcare-people' : business?.slug === 'omviraa' ? 'wellbeing' : business?.image || 'collaboration';
  const [active, setActive] = useState(0);
  return <section className="approach-feature" id="approach"><div className="approach-feature-inner">
    <div className="approach-visual"><Photo name={photo} alt={business ? 'Illustrative ' + business.sector.toLowerCase() + ' setting' : 'Illustrative team working together'}/><div><p className="eyebrow">{business ? business.name : 'The TMSG approach'}</p><p>{business ? business.line : 'Discover. Build. Scale. Institutionalise.'}</p></div></div>
    <div className="approach-body"><p className="eyebrow">How we build</p><h2>{business ? 'The thinking behind ' + business.name + '.' : <>From an opportunity<br/>to a lasting business.</>}</h2><div className="approach-stages">{items.map(([title, description], i) => <div className={active === i ? 'is-active' : ''} key={title}><h3><button type="button" aria-expanded={active === i} aria-controls={(business?.slug || 'group') + '-stage-' + i} onClick={() => setActive(i)}><span>{title}</span><ArrowRight size={19}/></button></h3><div id={(business?.slug || 'group') + '-stage-' + i} hidden={active !== i}><p>{description}</p>{!business && <p className="stage-context">{['The starting point is a relevant need, a considered opportunity and a clear reason to build.', 'People, systems and the operating foundations come together around the business purpose.', 'Technology, leadership and disciplined execution support the next stage of development.', 'Governance and professional teams support a business beyond its initial foundation.'][i]}</p>}</div></div>)}</div><TextLink href={business ? '/' + business.slug + '/contact' : '/leadership'}>{business ? 'Discuss a partnership' : 'Meet our founder'}</TextLink></div>
  </div></section>;
}

export function PageInvitation({business}: {business?: Business}) {
  return <section className="page-invitation"><div><p className="eyebrow">{business ? 'Connect with ' + business.name : 'Work with TMSG'}</p><h2>{business ? 'A conversation about ' + business.sector.toLowerCase() + '.' : 'Bring your perspective.\nExplore a partnership.'}</h2></div><div><p>{business ? 'Introduce your organisation and the opportunity you would like to explore.' : 'For entrepreneurs, institutions and partners with a shared long-term outlook.'}</p><a href={business ? '/' + business.slug + '/contact' : '/partner'}>Start a conversation<ArrowUpRight size={24}/></a></div></section>;
}
