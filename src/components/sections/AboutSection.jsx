export default function AboutSection() {
  return (
    <section id="about" className="about-section black-section" data-chapter="WHITE LIGHT" aria-labelledby="about-title">
      <div className="about-grid">
        <div className="about-copy reveal">
          <h2 id="about-title" className="about-title">
            <span>AB</span><span className="pixel-o">O</span><span>UT ME</span>
          </h2>
          <div className="about-intro">
            <p className="about-name">张睿</p>
            <p>AI 产品体验设计师 / UI/UX 设计师 / AIGC 交互设计师</p>
          </div>
          <p className="about-manifesto">I'M NOT A SINGLE COLOR.</p>
          <p className="about-body">White is not the absence of color. It is every color at once.</p>
          <dl className="resume-placeholder" aria-label="简历信息占位">
            <div><dt>Education</dt><dd>内容待补充</dd></div>
            <div><dt>Experience</dt><dd>内容待补充</dd></div>
            <div><dt>Skills</dt><dd>产品体验 / UI / UX / AIGC</dd></div>
            <div><dt>Contact</dt><dd>联系方式待补充</dd></div>
          </dl>
        </div>
        <figure className="about-portrait reveal">
          <div className="portrait-light" aria-hidden="true" />
          <img src="/profile.png" alt="张睿个人肖像" width="170" height="218" />
          <figcaption>Hello,<br />I'm Rui Zhang.</figcaption>
        </figure>
      </div>
    </section>
  );
}
