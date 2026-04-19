'use client';

import {
  resolveSubscriptionBrandSlug,
  simpleIconsCdnUrl,
} from '@/helpers/resolveSubscriptionBrandSlug';
import { useState } from 'react';

const ACCENT_BG = [
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200',
  'bg-amber-100 text-amber-800 dark:bg-amber-500/25 dark:text-amber-200',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/25 dark:text-fuchsia-200',
  'bg-sky-100 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200',
];

type SubscriptionBrandAvatarProps = {
  name: string;
  index: number;
  className?: string;
};

export function SubscriptionBrandAvatar({
  name,
  index,
  className = 'h-9 w-9 text-xs',
}: SubscriptionBrandAvatarProps) {
  const slug = resolveSubscriptionBrandSlug(name);
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const avatarClass = ACCENT_BG[index % ACCENT_BG.length] ?? ACCENT_BG[0];

  if (!slug || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full font-bold ${avatarClass} ${className}`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 ring-1 ring-neutral-200 dark:ring-white/15 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- внешний SVG с CDN, fallback через onError */}
      <img
        src={simpleIconsCdnUrl(slug)}
        alt=""
        width={36}
        height={36}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
