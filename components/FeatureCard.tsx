 // components/FeatureCard.tsx
"use client";

import type { ElementType } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ElementType; // نستقبل مكوّن الأيقونة نفسه
};

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,.18)] hover:bg-white/[.07] transition">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-white/90">{title}</h3>
      <p className="text-sm text-white/65">{description}</p>
    </div>
  );
}
