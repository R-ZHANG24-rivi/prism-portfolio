import { VISUAL } from '../../config/visual';

export default function SpectrumField() {
  return (
    <div className="spectrum-field" aria-hidden="true">
      <div className="white-beam" />
      <div className="spectrum-core" />
      <div className="spectrum-slices">
        {Array.from({ length: VISUAL.spectrum.sliceCount }, (_, index) => (
          <i key={index} style={{ '--slice': index, '--slice-offset': index - 9 }} />
        ))}
      </div>
      <div className="prism-shadow" />
    </div>
  );
}
