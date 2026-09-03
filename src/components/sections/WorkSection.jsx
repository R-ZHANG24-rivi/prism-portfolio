import ProjectList from '../ui/ProjectList';

export default function WorkSection({ projects, activeProject, onProjectChange, onPreviewChange, onProjectOpen }) {
  const activate = (index) => {
    onProjectChange(index);
    onPreviewChange(true);
  };

  return (
    <section id="work" className="work-section black-section" data-chapter="SPECTRUM" aria-labelledby="work-title">
      <div className="work-heading reveal">
        <h2 id="work-title">ONE LIGHT.<br /><span>MULTIPLE SPECTRUMS.</span></h2>
        <p>每一个项目，都是同一束光在不同问题中的折射。</p>
      </div>
      <div className="project-browser reveal" onPointerLeave={() => onPreviewChange(false)}>
        <div className="work-spectrum-state" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--slice-index': index }} />)}
        </div>
        <ProjectList projects={projects} activeProject={activeProject} onActivate={activate} onOpen={onProjectOpen} />
        <aside className="project-readout" aria-hidden="true">
          <span>λ {projects[activeProject].wavelength} NM</span>
          <strong>{projects[activeProject].spectrumLabel}</strong>
          <i />
        </aside>
      </div>
    </section>
  );
}
