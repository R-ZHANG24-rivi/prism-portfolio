export default function ProjectList({ projects, activeProject, onActivate, onOpen }) {
  return (
    <ul className="project-list" aria-label="项目列表">
      {projects.map((project, index) => (
        <li key={project.id}>
          <button
            type="button"
            className={index === activeProject ? 'is-active' : ''}
            style={{ '--row-color': project.primaryColor }}
            onPointerEnter={() => onActivate(index)}
            onFocus={() => onActivate(index)}
            onClick={() => onOpen(project)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen(project);
              }
            }}
            aria-label={`${project.index} ${project.title}，打开项目`}
          >
            <span>{project.index}</span>
            <strong>{project.title}</strong>
            <small>{project.spectrumLabel}<br />λ {project.wavelength} NM</small>
          </button>
        </li>
      ))}
    </ul>
  );
}
