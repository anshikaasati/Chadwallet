// components/ui/Skeleton/Skeleton.tsx
import React from "react";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps): React.JSX.Element {
  return (
    <div className={`animate-pulse bg-bg-surface rounded-md ${className}`} />
  );
}
export default Skeleton;
