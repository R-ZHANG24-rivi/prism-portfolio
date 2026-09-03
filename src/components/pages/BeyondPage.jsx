import PortfolioNav from './PortfolioNav';

const channels = ['Photography', 'Travel', 'Exhibitions', 'Personal Experiments', 'Daily Fragments'];

export function BeyondSection({ onContinue }) {
  return (
    <section className="beyond-page" id="beyond" aria-labelledby="beyond-title">
      <div className="beyond-orbit" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ '--orbit': index }} />)}</div>
      <header className="beyond-header">
        <p className="prism-kicker">04 / AFTER HOURS</p>
        <h2 id="beyond-title">THINGS THAT SHAPE<br /><span>HOW I SEE.</span></h2>
        <p>日常切片 / 光谱之外。保留给尚未归档的观察、行走与实验。</p>
      </header>
      <section className="beyond-index" aria-label="Beyond categories">
        {channels.map((channel, index) => (
          <div key={channel}><span>{String(index + 1).padStart(2, '0')}</span><h2>{channel}</h2><small>ARCHIVE NOT YET PUBLISHED</small></div>
        ))}
      </section>
      <button className="beyond-next" type="button" onClick={() => onContinue?.('ending')}>RECOMBINE <span>→</span></button>
    </section>
  );
}

export default function BeyondPage() {
  return (
    <main>
      <PortfolioNav />
      <BeyondSection onContinue={() => { window.location.href = '/#ending'; }} />
    </main>
  );
}
