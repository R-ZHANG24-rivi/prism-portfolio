import { useState } from 'react';

const links = [
  ['about', 'About'],
  ['work', 'Selected Work'],
  ['beyond', 'Beyond'],
];

export default function PortfolioNav({ activeSection, onNavigateSection, scrolled = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSectionClick = (event, section) => {
    if (!onNavigateSection) return;
    event.preventDefault();
    setMenuOpen(false);
    onNavigateSection(section);
  };

  return (
    <header className={`portfolio-nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <a className="portfolio-nav__brand" href="/#home" aria-label="返回 PRISM 首页" onClick={(event) => handleSectionClick(event, 'home')}>
        <span>Home</span>
      </a>
      <button
        className="portfolio-nav__toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="portfolio-primary-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? 'CLOSE' : 'MENU'}
      </button>
      <nav id="portfolio-primary-nav" aria-label="作品集页面导航">
        {links.map(([section, label]) => (
          <a
            key={section}
            href={`/#${section}`}
            aria-label={label.toUpperCase()}
            aria-current={activeSection === section ? 'location' : undefined}
            onClick={(event) => handleSectionClick(event, section)}
          >
            {label}<i aria-hidden="true">λ</i>
          </a>
        ))}
      </nav>
    </header>
  );
}
