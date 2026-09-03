import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { VISUAL } from '../../config/visual';

export default function CursorRefraction({ pointer }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (pointer.current.nx * 4.2 - ref.current.position.x) * VISUAL.pointer.damping;
    ref.current.position.y += (pointer.current.ny * 2.5 - ref.current.position.y) * VISUAL.pointer.damping;
    ref.current.material.opacity += ((pointer.current.active ? .09 : 0) - ref.current.material.opacity) * .06;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1.3]}>
      <circleGeometry args={[1.2, 64]} />
      <meshBasicMaterial transparent opacity={0} color="#8ad5ff" depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
