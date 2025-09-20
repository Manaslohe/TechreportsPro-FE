import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useTranslation } from '../../contexts/TranslationContext';

const BusinessAnimation = () => {
  const { translate } = useTranslation();

  const bars = [
    { height: 65, color: '#60A5FA', label: translate('revenue') },
    { height: 85, color: '#818CF8', label: translate('growth') },
    { height: 45, color: '#60A5FA', label: translate('sales') },
    { height: 95, color: '#818CF8', label: translate('performance') },
    { height: 75, color: '#60A5FA', label: translate('analytics') },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center shadow-xl rounded-lg bg-white/10">
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#60A5FA" />
        </Sphere>
        <OrbitControls enableZoom={false} />
      </Canvas>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-4 flex gap-4">
        {bars.map((bar, index) => (
          <div key={index} className="text-xs text-white/80">
            {bar.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessAnimation;