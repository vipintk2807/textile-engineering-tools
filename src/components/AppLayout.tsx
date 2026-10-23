import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { isActive, NAV_ITEMS, toHref } from '../app/navigation';

interface AppLayoutProps {
  currentPath: string;
  pageTitle: string;
  children: ReactNode;
}

export function AppLayout({ currentPath, pageTitle, children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.title = `${pageTitle} – Textile Engineering Tools`;
  }, [pageTitle]);

  // After navigating, move focus to the main content so keyboard and screen
  // reader users start at the new page. Skipped on first load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo(0, 0);
  }, [currentPath]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  return (
    <div className="app-shell" onKeyDown={handleKeyDown}>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault();
        mainRef.current?.focus();
      }}>
        Skip to main content
      </a>
      <header className="app-header">
        <p className="app-header__title">
          <a href={toHref('/')}>Textile Engineering Tools</a>
        </p>
        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
      </header>
      <div className="app-body">
        <nav
          id="site-navigation"
          className={menuOpen ? 'sidebar sidebar--open' : 'sidebar'}
          aria-label="Main navigation"
          onClick={() => setMenuOpen(false)}
        >
          <ul className="sidebar__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <a
                  className="sidebar__link"
                  href={toHref(item.path)}
                  aria-current={isActive(item.path, currentPath) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main-content" className="main" ref={mainRef} tabIndex={-1}>
          <div className="main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
