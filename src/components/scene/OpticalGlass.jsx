import { MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { PROJECTS } from '../../data/projects';
import { VISUAL } from '../../config/visual';
import * as THREE from 'three';
import PreviewImage from './PreviewImage';

const visibleScale = new THREE.Vector3(0.72, 0.72, 0.72);
const hiddenScale = new THREE.Vector3(0.62, 0.62, 0.62);

export default function OpticalGlass({ pointer, activeProject, visible }) {
  const group = useRef();
  const glass = useRef();
  const { viewport } = useThree();
  const project = PROJECTS[activeProject];
  const targetTint = new THREE.Color(project.glassTint);

  useFrame(() => {
    if (!group.current) return;
    const targetX = pointer.current.nx * viewport.width * 0.48 + 1.05;
    const targetY = pointer.current.ny * viewport.height * 0.46 - 0.12;
    group.current.position.x += (targetX - group.current.position.x) * VISUAL.preview.damping;
    group.current.position.y += (targetY - group.current.position.y) * VISUAL.preview.damping;
    group.current.rotation.z += ((pointer.current.velocityX * -0.0015) - group.current.rotation.z) * 0.06;
    group.current.scale.lerp(visible ? visibleScale : hiddenScale, 0.07);
    group.current.visible = visible || group.current.scale.x > 0.63;
    if (glass.current) glass.current.color.lerp(targetTint, 0.045);
  });

  return (
    <group ref={group} position={[1, 0, 1.6]} scale={0.62}>
      <mesh>
        <boxGeometry args={[2.5, 1.58, 0.12]} />
        <MeshTransmissionMaterial ref={glass} transmission={1} roughness={0.035} thickness={0.9} ior={1.48} chromaticAberration={VISUAL.preview.chromaticShift} distortion={VISUAL.preview.refraction} distortionScale={0.2} color={project.glassTint} transparent opacity={visible ? 0.72 : 0} />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[2.54, 1.62]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={visible ? 0.055 : 0} wireframe />
      </mesh>
      {PROJECTS.map((item, index) => (
        <PreviewImage
          key={item.id}
          src={item.preview}
          active={index === activeProject}
          visible={visible}
          order={index}
        />
      ))}
    </group>
  );
}
