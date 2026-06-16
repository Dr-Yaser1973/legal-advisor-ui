 // components/admin/GrowthSparkline.tsx
"use client";

export default function GrowthSparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) {
    return <div style={{ height: 48 }} />;
  }

  const width = 300;
  const height = 48;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // تحويل القيم إلى إحداثيات
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return { x, y };
  });

  // مسار الخط
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // مسار التعبئة (يغلق للأسفل)
  const areaPath =
    `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div style={{ position: "relative", height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
        role="img"
        aria-label="منحنى نمو المستخدمين"
      >
        <path d={areaPath} fill="rgba(16,185,129,0.12)" />
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}