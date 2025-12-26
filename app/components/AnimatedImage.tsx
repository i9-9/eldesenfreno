'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AnimatedImageProps extends Omit<ImageProps, 'onLoad'> {
  animationDelay?: number;
}

const AnimatedImage = ({ className = '', animationDelay = 0, ...props }: AnimatedImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden">
      <Image
        {...props}
        className={`${className} ${isVisible ? 'animate-blur-in' : 'opacity-0 blur-lg'}`}
        style={{
          ...props.style,
          animationDelay: isVisible ? `${animationDelay}ms` : '0ms',
          animationFillMode: 'both',
        }}
      />
    </div>
  );
};

export default AnimatedImage;

