import * as THREE from 'three';

export const createIcosahedronGeometry = () => {
  return new THREE.IcosahedronGeometry(1, 0);
};

export const createMaterialWithColor = (color: string, opacity: number = 0.6) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    wireframe: true,
  });
};

export const getRandomPosition = (range: number = 10) => {
  return {
    x: (Math.random() - 0.5) * range,
    y: (Math.random() - 0.5) * range,
    z: (Math.random() - 0.5) * range,
  };
};

export const getRandomRotation = () => {
  return {
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
  };
};
