"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type WeeklyProjectProgressBarProps = {
  progress: number;
  progressLabel: string;
};

export function WeeklyProjectProgressBar({
  progress,
  progressLabel,
}: WeeklyProjectProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const chartData = [
    {
      name: progressLabel,
      value: clampedProgress,
    },
    {
      name: "Remaining",
      value: 100 - clampedProgress,
    },
  ];
  const colors = ["#0b6e79", "#c6d9df"];

  return (
    <div className="relative mx-auto h-40 w-40 rounded-full bg-linear-to-b from-[#eff6f9] to-[#e4eef2] p-1 dark:from-[#0f1b21] dark:to-[#15242b]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={66}
            stroke="none"
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationBegin={100}
            animationDuration={700}
          >
            {chartData.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()}%`}
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #d0dbe0",
              boxShadow: "0 8px 22px rgba(0, 0, 0, 0.12)",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-[#0b6e79] dark:text-[#8fd8e4]">
          {clampedProgress}%
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#4e6570] dark:text-[#8aa3ad]">
          {progressLabel}
        </span>
      </div>
    </div>
  );
}
