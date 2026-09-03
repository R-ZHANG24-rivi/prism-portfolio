import PortfolioNav from './PortfolioNav';
import { withBasePath } from '../../utils/paths';

export function EndingSection({ onBackToTop }) {
  return (
    <section className="ending-page" id="ending" aria-labelledby="ending-title">
      <div className="ending-page__spectrum" aria-hidden="true" />
      <button className="ending-page__prism" type="button" onClick={() => onBackToTop?.('home')} aria-label="返回 PRISM 首页">
        <img src={withBasePath('/assets/portfolio/home/prism.png')} alt="透明棱镜" />
      </button>
      <p className="ending-page__kicker">05 / RECOMBINE</p>
      <h2 id="ending-title"><span>THANKS</span><span>FOR YOUR</span><span>TIME</span></h2>
      <footer className="ending-page__footer">
        <div><strong>张睿 / RIVI ZHANG</strong><span>PORTFOLIO 2026</span></div>
        <a href="mailto:1277929459@qq.com">EMAIL <span>1277929459@qq.com</span></a>
        <div>RESUME <span>待补充</span></div>
        <a href={withBasePath('/#home')} onClick={(event) => { if (onBackToTop) { event.preventDefault(); onBackToTop('home'); } }}>BACK TO TOP <span>↑</span></a>
      </footer>
    </section>
  );
}

export default function EndingPage() {
  return (
    <main>
      <PortfolioNav />
      <EndingSection onBackToTop={() => { window.location.href = withBasePath('/#home'); }} />
    </main>
  );
}
