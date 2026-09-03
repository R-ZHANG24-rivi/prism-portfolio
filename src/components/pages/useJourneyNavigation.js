import { useCallback, useEffect, useState } from 'react';
import { withBasePath } from '../../utils/paths';

export const JOURNEY_SECTIONS = ['home', 'about', 'work', 'beyond', 'ending'];

const getHashSection = () => {
  const section = window.location.hash.replace('#', '');
  return JOURNEY_SECTIONS.includes(section) ? section : 'home';
};

export default function useJourneyNavigation() {
  const [currentSection, setCurrentSection] = useState(getHashSection);

  const scrollToSection = useCallback((section, updateHash = true) => {
    const target = document.getElementById(section);
    if (!target) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (updateHash) window.history.pushState({}, '', withBasePath(`/#${section}`));
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setCurrentSection(section);
  }, []);

  useEffect(() => {
    const sections = JOURNEY_SECTIONS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setCurrentSection(visible.target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = getHashSection();
    let innerFrame;
    const settleScroll = () => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      setCurrentSection(section);
    };
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(settleScroll);
    });
    const settleTimer = window.setTimeout(settleScroll, 480);
    window.addEventListener('load', settleScroll, { once: true });
    return () => {
      window.cancelAnimationFrame(outerFrame);
      if (innerFrame) window.cancelAnimationFrame(innerFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener('load', settleScroll);
    };
  }, [scrollToSection]);

  useEffect(() => {
    const handleHistory = () => scrollToSection(getHashSection(), false);
    window.addEventListener('popstate', handleHistory);
    window.addEventListener('hashchange', handleHistory);
    return () => {
      window.removeEventListener('popstate', handleHistory);
      window.removeEventListener('hashchange', handleHistory);
    };
  }, [scrollToSection]);

  return { currentSection, scrollToSection };
}
