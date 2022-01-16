import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

function createMockData(days: number) {
  let data = [];
  for (let i = 0; i < days; i++) {
    data.push({
      now: {
        date: format(new Date(new Date(2019, 0, i + 1).getTime()), "dd") + "th",
        views: Math.round(Math.random() * 1000 + i * 75),
        clicks: Math.round(Math.random() * 1000 + i * 10),
        skips: Math.round(Math.random() * 1000 + i * 10),
      },
      last: {
        views: Math.round(Math.random() * 1000 + i * 75),
        clicks: Math.round(Math.random() * 1000 + i * 10),
        skips: Math.round(Math.random() * 1000 + i * 10),
      },
    });
  }
  return data;
}

export default function Chart() {
  let data = createMockData(30);

  let highestValue = 0;
  data.forEach((d) => {
    if (d.now.views > highestValue) highestValue = d.now.views;
    if (d.last.views > highestValue) highestValue = d.last.views;
    if (d.now.clicks > highestValue) highestValue = d.now.clicks;
    if (d.last.clicks > highestValue) highestValue = d.last.clicks;
    if (d.now.skips > highestValue) highestValue = d.now.skips;
    if (d.last.skips > highestValue) highestValue = d.last.skips;
  });

  highestValue = Math.floor(highestValue / 1000) + 1;
  let verticalTicks = Array(highestValue)
    .fill(0)
    .map((_, i) => (i + 1) * 1000);
  let hortizontalTicks = Array(30)
    .fill(0)
    .map((_, i) => {
      if (i % 2 === 0) return i;
      else return i + 1;
    });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 25, right: 0, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="current" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3751FF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3751FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="last" x1="0" y1="0" x2="0" y2="1">
            <stop offset="100%" stopColor="#DFE0EB" stopOpacity={0} />
            <stop offset="100%" stopColor="#DFE0EB" stopOpacity={0} />
          </linearGradient>
        </defs>

        <YAxis axisLine={false} opacity={0.5} ticks={verticalTicks} />
        <XAxis
          axisLine={true}
          opacity={0.5}
          ticks={hortizontalTicks}
          dataKey={"now.date"}
        />
        <Tooltip />
        <CartesianGrid
          vertical={false}
          strokeDasharray="1 0"
          opacity={0.5}
          stroke="#aab8c2"
        />
        <Area
          type="monotone"
          dataKey="now.views"
          stroke="#3751FF"
          fillOpacity={1}
          fill="url(#current)"
        />
        <Area
          type="monotone"
          dataKey="last.views"
          stroke="#DFE0EB"
          fillOpacity={1}
          fill="url(#last)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
