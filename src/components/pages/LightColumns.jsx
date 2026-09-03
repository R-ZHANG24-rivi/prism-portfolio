import { withBasePath } from '../../utils/paths';

const names = Array.from({ length: 8 }, (_, index) => `Rectangle 34624184${index + 1}.svg`);

export default function LightColumns({ page, className = '', count = 16 }) {
  return <div className={`light-columns ${className}`} aria-hidden="true">{Array.from({ length: count }, (_, index) => <img key={index} src={withBasePath(`/assets/portfolio/${page}/illustrations/${names[index % names.length]}`)} alt="" />)}</div>;
}
