'use client';

import type {ReactNode} from 'react';
import {ApproachFeature, PageInvitation, Photo} from './InstitutionalBlocks';
import {ArrowRight, ArrowUpRight, ChevronRight} from 'lucide-react';
import {businesses, process, regions, type Business} from '@/content/site';
import {stories} from '@/content/stories';

const businessPath = (business: Business, page = '') =>
  `/${business.slug}${page ? '/' + page : ''}`;

const businessDescriptions: Record<string, string> = {
  zustmed: 'Healthcare financing, hospital financial management, claims support and technology.',
  omviraa: 'A wellness sanctuary concept combining nature, Indian wellbeing and contemporary comfort.',
  'shahi-estate': 'Premium real estate opportunities, destination-led developments and curated assets.',
  'shahi-world': 'A hospitality vision for resorts, suites, destination experiences and celebrations.',
  'emerging-ventures': 'Future interests in finance, technology, consumer brands, luxury, travel and aviation.',
};

function TextLink({href, children}: {href: string; children: ReactNode}) {
  return <a className="inline-link" href={href}>{children}<ArrowRight size={17}/></a>;
}

export function BusinessDirectory({full = false}: {full?: boolean}) {
  return (
    <section className={'section business-index' + (full ? ' business-index-full' : '')} id="businesses">
      <div className="business-index-heading reveal">
        <div>
          <p className="eyebrow">The portfolio</p>
          <h2>{full ? 'Choose a business' : 'The TMSG businesses'}</h2>
        </div>
        <p>Four named businesses, each with its own sector focus, alongside a platform for future business interests.</p>
      </div>
      <div className="business-index-rows">
        {businesses.map(b => (
          <a className="business-index-row reveal" key={b.slug} href={businessPath(b)}>
            <Photo name={b.slug === 'zustmed' ? 'healthcare-people' : b.slug === 'omviraa' ? 'wellbeing' : b.image} alt={'Illustrative ' + b.sector.toLowerCase() + ' photograph'}/>
            <span className="business-index-body">
              <span className="business-index-sector">{b.slug === 'emerging-ventures' ? 'Future interests' : b.sector}</span>
              <h3 className={'business-index-name ' + b.slug}>{b.name}</h3>
              <p>{businessDescriptions[b.slug]}</p>
              <span className="business-index-action"><span>Visit website</span><ArrowUpRight size={18}/></span>
            </span>
          </a>
        ))}
      </div>
      {!full && <div className="business-index-bottom"><TextLink href="/businesses">View the business directory</TextLink></div>}
    </section>
  );
}

export function BusinessApproach({business}: {business?: Business}) {
  return <ApproachFeature business={business}/>;
}

export function EditorialMasthead({eyebrow, title, description, children, business}: {
  eyebrow: string; title: ReactNode; description: string; children?: ReactNode; business?: Business;
}) {
  return (
    <section className="section editorial-masthead">
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb"><a href="/">TMSG</a><ChevronRight size={13}/>{business && <><a href={businessPath(business)}>{business.name}</a><ChevronRight size={13}/></>}<span>{eyebrow}</span></nav>
      <div className="editorial-masthead-body"><h1>{title}</h1><div><p>{description}</p>{children && <div className="editorial-masthead-action">{children}</div>}</div></div>
    </section>
  );
}

export function ContactRoutes() {
  return (
    <section className="section contact-routes">
      <div className="contact-routes-intro reveal"><p className="eyebrow">Connect with TMSG</p><h2>Business proposals<br/>and careers</h2><p>Choose the route that matches your enquiry.</p></div>
      <div className="contact-route-list">
        <a className="reveal" href="/partner"><div><span className="contact-route-label">Partnerships</span><h3>Share a business proposal</h3><p>Tell us about your organisation, the relevant business and the opportunity you would like to explore.</p></div><ArrowUpRight size={27}/></a>
        <a className="reveal" href="/careers"><div><span className="contact-route-label">Careers</span><h3>Introduce your experience</h3><p>Register your professional background and area of interest. Current expressions of interest are separate from confirmed vacancies.</p></div><ArrowUpRight size={27}/></a>
      </div>
    </section>
  );
}

const enquiryDescriptions: Record<string, string> = {
  zustmed: 'Share your organisation’s healthcare financing, operations or technology interests.',
  omviraa: 'Discuss a partnership relevant to the Omviraa wellness concept.',
  'shahi-estate': 'Describe a location, asset or real estate opportunity you would like to discuss.',
  'shahi-world': 'Share a hospitality, destination or development proposal.',
  'emerging-ventures': 'Introduce your business, sector and proposed relationship with TMSG.',
};

export function RelatedEnquiry({business}: {business?: Business}) {
  return <PageInvitation business={business}/>;
}

export function GroupAffiliation({business}: {business: Business}) {
  return (
    <section className="section group-affiliation">
      <span className="affiliation-crest"><img src="/images/tmsg-logo.png" alt="TMSG crest" width="1264" height="848" loading="lazy"/></span>
      <div><p className="eyebrow">A TMSG business</p><h2>Part of The Mrityunjay Shahi Group</h2><p>{business.name} shares the group’s focus on integrity and long-term business development.</p></div>
      <TextLink href="/about">About the group</TextLink>
    </section>
  );
}

export function FocusIndex({business}: {business: Business}) {
  return (
    <div className="business-focus-index">
      {business.areas.slice(0, 4).map(([title, description], i) => (
        <a className="reveal" key={title} href={businessPath(business, 'focus') + '#focus-' + i}>
          <div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={20}/>
        </a>
      ))}
    </div>
  );
}

export function GroupBriefs({full = false}: {full?: boolean}) {
  const list = full ? stories : stories.slice(0, 3);
  return (
    <section className="section group-briefs">
      <div className="briefs-introduction reveal"><p className="eyebrow">From the group</p><h2>{full ? 'Read the briefs' : 'Group & business briefs'}</h2><p>Introductions to the group, its business concepts and its published priorities.</p>{!full && <TextLink href="/news">All group briefs</TextLink>}</div>
      <div className="briefs-index">
        {list.map(story => (
          <a className="reveal" href={'/news/' + story.slug} key={story.slug}>
            <span className="brief-brand">{story.brand}<small>{story.category}</small></span>
            <div><h3>{story.title}</h3><p>{story.summary}</p></div><ArrowRight size={21}/>
          </a>
        ))}
      </div>
    </section>
  );
}

export function FounderProfile() {
  return (
    <section className="section founder-editorial">
      <div className="founder-editorial-heading reveal"><p className="eyebrow">Founder & Chairman</p><h2>Mrityunjay Shahi</h2><p>The Mrityunjay Shahi Group</p></div>
      <div className="founder-editorial-bio reveal"><p className="lead">Mrityunjay Shahi founded TMSG with a vision to develop a diversified business platform across healthcare, wellness, real estate, hospitality and emerging sectors.</p><p>His stated approach considers the longevity and credibility of a business alongside financial growth and its contribution to the people it serves.</p></div>
      <figure className="chairman-vision reveal"><figcaption>Chairman’s vision</figcaption><blockquote>“My vision is to build institutions that outlive individual businesses - organisations trusted for their ambition, integrity and ability to create value over generations.”</blockquote></figure>
    </section>
  );
}

export function MarketPriorities() {
  return <dl className="market-priorities">{regions.map(([name, description]) => <div className="reveal" key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl>;
}
