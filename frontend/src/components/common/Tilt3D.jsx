import React, { useRef, useState } from 'react';

/**
 * Tilt3D Component
 * Adds interactive 3D perspective tilt physics and specular glare to any element.
 * Children can specify `translateZ(px)` transforms to pop outward in 3D space.
 */
export const Tilt3D = ({
  children,
  className = '',
  maxTilt = 12, // Max rotation degrees
  scale = 1.02, // Scale on hover
  perspective = 1000,
  glare = true,
  glareOpacity = 0.25,
  style = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Calculate rotation (-maxTilt to +maxTilt)
    const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
    const rotateX = -((y - height / 2) / (height / 2)) * maxTilt;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out',
    });

    if (glare) {
      setGlarePos({
        x: (x / width) * 100,
        y: (y / height) * 100,
        opacity: glareOpacity,
      });
    }
  };

  const handleMouseEnter = () => {
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: glareOpacity }));
    }
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative preserve-3d will-change-transform ${className}`}
      style={{
        ...style,
        ...tiltStyle,
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare Reflection */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-30 transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />
      )}
    </div>
  );
};

export default Tilt3D;
