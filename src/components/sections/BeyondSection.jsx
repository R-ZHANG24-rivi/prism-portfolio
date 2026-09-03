export default function BeyondSection() {
  return (
    <section id="beyond" className="beyond-section black-section" data-chapter="BEYOND" aria-labelledby="beyond-title">
      <div className="beyond-field" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
      </div>
      <div className="beyond-copy reveal">
        <h2 id="beyond-title">BEYOND<br /><span>OTHER SIDES</span></h2>
        <p>Photography / Travel / Music / Exhibitions / Daily Fragments / Personal Experiments</p>
        <small>Digital scrapbook structure reserved for the next phase.</small>
      </div>
    </section>
  );
}
