import { useCallback, useEffect, useState } from 'react';
import { PROJECTS, getProjectBySlug } from './data/projects';
import AboutPage from './components/pages/AboutPage';
import BeyondPage from './components/pages/BeyondPage';
import EndingPage from './components/pages/EndingPage';
import PortfolioHome from './components/pages/PortfolioHome';
import SpectrumPage from './components/pages/SpectrumPage';
import ProjectPageShell from './components/projects/ProjectPageShell';
import PrismLoader from './components/ui/PrismLoader';
import { BASE_PATH, currentAppPath, withBasePath } from './utils/paths';

const CRITICAL_ASSETS = [
  withBasePath('/assets/portfolio/home/prism.png'),
  withBasePath('/assets/portfolio/home/prism-shadow.png'),
  withBasePath('/assets/portfolio/about/portrait-composite.png'),
  ...PROJECTS.map((project) => project.pages?.[0] || project.preview),
];

export default function App() {
  const [path, setPath] = useState(currentAppPath);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(currentAppPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath) => {
    const nextUrl = new URL(nextPath, window.location.origin);
    const destination = `${BASE_PATH}${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== destination) window.history.pushState({}, '', destination);
    setPath(nextUrl.pathname);
    if (!nextUrl.hash) window.scrollTo(0, 0);
  };

  const completeIntro = useCallback(() => setReady(true), []);

  let page;

  if (path === '/about' || path === '/about/') page = <AboutPage onNavigate={navigate} />;
  else if (path === '/spectrum' || path === '/spectrum/') page = <SpectrumPage projects={PROJECTS} onNavigate={navigate} />;
  else if (path === '/beyond' || path === '/beyond/') page = <BeyondPage />;
  else if (path === '/ending' || path === '/ending/') page = <EndingPage />;

  const projectMatch = path.match(/^\/(?:project|work)\/([^/]+)\/?$/);
  if (!page && projectMatch) {
    const project = getProjectBySlug(projectMatch[1]);
    if (project) {
      const index = PROJECTS.findIndex((item) => item.id === project.id);
      const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
      page = (
        <ProjectPageShell
          project={project}
          nextProject={nextProject}
          onClose={() => navigate('/#work')}
          onNavigate={(item) => navigate(`/work/${item.slug}`)}
        />
      );
    }
  }

  if (!page) page = <PortfolioHome projects={PROJECTS} onNavigate={navigate} />;

  return (
    <>
      {!ready && <PrismLoader assets={CRITICAL_ASSETS} onComplete={completeIntro} />}
      {ready && page}
    </>
  );
}
