import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { PROJECTS } from '../../data/projects';

const colors = ['#ff7a32', '#ff3f54', '#ff2a8a', '#f235ff', '#8555ff', '#458cff', '#5eeaff'];

export default function Spectrum({ pointer, activeProject }) {
  const group = useRef();
  const materials = useRef([]);
  const target = new THREE.Color(PROJECTS[activeProject].spectrumColor);
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x += ((2.05 + pointer.current.nx * 0.13) - group.current.position.x) * 0.035;
    group.current.position.y += ((pointer.current.ny * 0.08 + Math.sin(state.clock.elapsedTime * 0.2) * 0.025) - group.current.position.y) * 0.035;
    materials.current.forEach((material, index) => {
      if (!material) return;
      const base = new THREE.Color(colors[index]);
      const distance = Math.abs(index - 3) / 3;
      const wavelength = target.clone().lerp(base, 0.28 + distance * 0.18);
      material.color.lerp(wavelength, 0.035);
    });
  });
  return (
    <group ref={group} position={[2.05, 0, -0.8]} rotation={[0, -0.12, -0.035]}>
      {colors.map((color, index) => (
        <mesh key={color} position={[index * 0.18, (index - 3) * -0.085, -index * 0.025]}>
          <planeGeometry args={[4.5, 0.42]} />
          <meshBasicMaterial ref={(material) => { materials.current[index] = material; }} color={color} transparent opacity={0.065} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
