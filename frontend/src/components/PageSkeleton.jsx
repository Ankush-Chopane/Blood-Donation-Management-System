import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-[1.4rem] ${className}`} aria-hidden="true" />
);

export const SectionSkeleton = () => (
  <div className="mx-auto grid max-w-[1200px] gap-6 px-6 py-8 md:grid-cols-2 xl:grid-cols-3">
    <SkeletonBlock className="h-44" />
    <SkeletonBlock className="h-44" />
    <SkeletonBlock className="h-44" />
  </div>
);

const PageSkeleton = ({ compact = false }) => {
  return (
    <div
      className={`min-h-screen bg-darkBg text-lightGray ${compact ? 'px-6 py-10' : 'px-6 py-28'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="mx-auto max-w-[1260px]">
        <div className="glass-card mb-8 rounded-[2rem] p-6">
          <SkeletonBlock className="mb-4 h-5 w-36" />
          <SkeletonBlock className="mb-3 h-12 w-2/3" />
          <SkeletonBlock className="h-5 w-1/2" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
          <SkeletonBlock className="h-[360px]" />
          <SkeletonBlock className="h-[360px]" />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
