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
  let multiplier = 1000;
  for (let i = 0; i < days; i++) {
    data.push({
      date: format(new Date(new Date(2019, 0, i + 1).getTime()), "dd") + "th",
      now: {
        views: Math.round(Math.random() * multiplier + i * 75),
        clicks: Math.round(Math.random() * multiplier + i * 10),
        skips: Math.round(Math.random() * multiplier + i * 10),
      },
      last: {
        views: Math.round(Math.random() * multiplier + i * 75),
        clicks: Math.round(Math.random() * multiplier + i * 10),
        skips: Math.round(Math.random() * multiplier + i * 10),
      },
    });
  }
  return data;
}

export default function Chart({ chartData }: { chartData: Array<any> }) {
  let data = chartData;
  let length = data.length;

  if (length <= 1)length= 31; 

  // ensure data has at least 30 days. if a data does not have any data, default data on that day to 0
  if (data.length < length && data.length !== length) {
    let missingDays: Array<any> = [];
    for (let i = 1; i < length; i++) {
      missingDays.push(`${i}th`);
    }
    // For each entry to data
    for (let i = 0; i < data.length; i++) {
      // check if the date is in missingDays
      if (missingDays.includes(data[i].date))
        // if it is, remove it from missingDays
        missingDays.splice(missingDays.indexOf(data[i].date), 1);
    }
    // For each missing day
    for (let i = 0; i < missingDays.length; i++) {
      let date = missingDays[i];

      // Ensure right format
      if (date.split("th")[0] < 10) date = `0${date}`;

      // add a new entry to data
      data.push({
        now: {
          date: date,
          views: 0,
          clicks: 0,
          skips: 0,
        },
        last: {
          views: 0,
          clicks: 0,
          skips: 0,
        },
      });
    }
  }

  // Sort data by date
  data.sort((a, b) => {
    function formatify(str: string) {
      try {
        return parseInt(str.replace("th", ""));
      } catch (error) {
        console.error(error, str);
        return 0;
      }
    }

    if (formatify(a.date) < formatify(b.date)) return -1;
    if (formatify(a.date) > formatify(b.date)) return 1;
    return 0;
  });

  let highestValue = 0;
  data.forEach((d) => {
    if (d.now.views > highestValue) highestValue = d.now.views;
    if (d.last.views > highestValue) highestValue = d.last.views;
    if (d.now.clicks > highestValue) highestValue = d.now.clicks;
    if (d.last.clicks > highestValue) highestValue = d.last.clicks;
    if (d.now.skips > highestValue) highestValue = d.now.skips;
    if (d.last.skips > highestValue) highestValue = d.last.skips;
  });

  let tickStep: number;
  if (highestValue > 10000) tickStep = 10000;
  else if (highestValue > 1000) tickStep = 1000;
  else if (highestValue > 100) tickStep = 100;
  else if (highestValue > 10) tickStep = 10;
  else if (highestValue > 1) tickStep = 1;
  else tickStep = 0.1;

  highestValue = Math.floor(highestValue / tickStep) + 1;

  let verticalTicks = Array(highestValue)
    .fill(0)
    .map((_, i) => (i + 1) * tickStep);
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
          dataKey={"date"}
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
