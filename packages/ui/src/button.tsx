'use client';

import { ReactNode, useCallback } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  const handleClick = useCallback(() => alert(`Hello from your ${appName} app!`), [appName]);
  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
