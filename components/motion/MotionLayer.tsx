'use client';

import {useEffect, useRef} from 'react';
import {useMotionOn} from './context';

const PREVIEWS: Record<string, string> = {
  '/zustmed': '/images/healthcare.webp',
  '/omviraa': '/images/wellness.webp',
  '/shahi-estate': '/images/estate.webp',
  '/shahi-world': '/images/hospitality.webp',
  '/emerging-ventures': '/images/ventures.webp',
};

const MAGNETIC = '.cta, .nav-partner, .footer-talk, .brand-primary-link, .page-invitation a';
const TRAIL = '.portfolio-strip > a, .portfolio-feature-photo';

export function MotionLayer({path}: {path: string}) {
  const on = useMotionOn();
  const cursorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(min-width: 760px)').matches;
    document.documentElement.classList.toggle('tmsg-motion', on);
    document.documentElement.classList.toggle('tmsg-cursor', on && fine);
    return () => {
      document.documentElement.classList.remove('tmsg-motion');
      document.documentElement.classList.remove('tmsg-cursor');
    };
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const cursor = cursorRef.current;
    const preview = previewRef.current;
    const bar = barRef.current;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let frame = 0;
    let magnet: HTMLElement | null = null;

    function placeJump() {
      const nav = document.querySelector<HTMLElement>('.page-jumps');
      const marker = nav?.querySelector<HTMLElement>('.jump-marker');
      if (!nav || !marker) return;
      const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];
      const y = window.scrollY + 150;
      let current = links[0];
      for (const link of links) {
        const id = link.getAttribute('href')?.slice(1);
        const section = id ? document.getElementById(id) : null;
        if (section && section.offsetTop <= y) current = link;
      }
      if (!current) return;
      const linkBox = current.getBoundingClientRect();
      const navBox = nav.getBoundingClientRect();
      marker.style.width = linkBox.width + 'px';
      marker.style.transform = 'translateX(' + (linkBox.left - navBox.left + nav.scrollLeft) + 'px)';
    }

    function onScroll() {
      const scrolled = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (scrolled > 0 ? window.scrollY / scrolled : 0) + ')';
      const agenda = document.querySelector<HTMLElement>('.sustainability-agenda');
      if (agenda) {
        const box = agenda.getBoundingClientRect();
        const total = Math.max(agenda.offsetHeight - window.innerHeight * 0.35, 1);
        const seen = Math.min(1, Math.max(0, -box.top / total));
        agenda.style.setProperty('--rail', String(seen));
      }
      placeJump();
    }

    const lit = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('is-lit');
      }
    }, {threshold: 0.35});
    document.querySelectorAll('.approach-stages > div, .healthcare-ecosystem article, .agenda-columns > article, .brand-story-principles article').forEach(node => lit.observe(node));

    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', String(event.clientX / window.innerWidth));
        document.documentElement.style.setProperty('--my', String(event.clientY / window.innerHeight));
        const target = event.target instanceof Element ? event.target : null;
        if (cursor && fine) {
          cursor.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px)';
          cursor.classList.toggle('is-hot', Boolean(target?.closest('a, button')));
          cursor.classList.toggle('is-hidden', Boolean(target?.closest('.legal-document, .enquiry-form')));
        }
        const trail = target?.closest<HTMLElement>(TRAIL);
        if (trail) {
          const box = trail.getBoundingClientRect();
          trail.style.setProperty('--lx', String((event.clientX - box.left) / box.width));
          trail.style.setProperty('--ly', String((event.clientY - box.top) / box.height));
        }
        const link = target?.closest<HTMLAnchorElement>('.business-quicklinks > a');
        const src = link ? PREVIEWS[link.pathname] : undefined;
        if (preview) {
          if (src) {
            const image = preview.querySelector('img');
            if (image && image.getAttribute('src') !== src) image.setAttribute('src', src);
            preview.style.opacity = '1';
            preview.style.transform = 'translate(' + (event.clientX + 18) + 'px,' + (event.clientY - 70) + 'px)';
          } else {
            preview.style.opacity = '0';
          }
        }
        const next = target?.closest<HTMLElement>(MAGNETIC) ?? null;
        if (magnet && magnet !== next) magnet.style.transform = '';
        magnet = next;
        if (magnet) {
          const box = magnet.getBoundingClientRect();
          const dx = (event.clientX - (box.left + box.width / 2)) / box.width;
          const dy = (event.clientY - (box.top + box.height / 2)) / box.height;
          magnet.style.transform = 'translate(' + (dx * 10) + 'px,' + (dy * 8) + 'px)';
        }
      });
    }

    function onLeave() {
      if (magnet) magnet.style.transform = '';
      magnet = null;
      if (preview) preview.style.opacity = '0';
    }

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      lit.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (magnet) magnet.style.transform = '';
    };
  }, [on, path]);

  if (!on) return null;
  return <>
    <div ref={barRef} className="scroll-progress" aria-hidden="true"/>
    <div ref={cursorRef} className="motion-cursor" aria-hidden="true"/>
    <div ref={previewRef} className="motion-preview" aria-hidden="true"><img alt=""/></div>
  </>;
}
