// src/components/Avatar.tsx
import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number; // default 32px
  rounded?: boolean;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 32,
  rounded = true,
  alt,
}) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const fullSrc =
    src?.startsWith('http') || src?.startsWith('data:')
      ? src
      : src
      ? `http://localhost:3000/uploads/avatars/${src}`
      : fallback;

  return (
    <img
      src={fullSrc}
      alt={alt || `${name}'s avatar`}
      style={{
        width: size,
        height: size,
        borderRadius: rounded ? '9999px' : '4px',
        objectFit: 'cover',
      }}
    />
  );
};

export default Avatar;
