export default function getHistory(
  history: {
    contentID: string;
    clicks: number;
    views: number;
    skips: number;
    date: string;
  }[],
  content: { contentID: string },
  performance: Map<string, any>
): Map<string, any> {
  if (!history) throw new Error("history is undefined");

  let dailyContentPerformances: Map<string, any> = new Map<string, any>();

  history.forEach(
    (data: {
      contentID: string;
      clicks: number;
      views: number;
      skips: number;

      date: string;
    }) => {
      if (data.contentID === content.contentID) {
        // Create time key with format YYYY-MM-DD
        let timeKey = new Date(data.date).toISOString().split("T")[0];

        // Ensure we are setting data that is higher than the previous entry (so we do not overwrite new data with old data)
        let views = data.views;
        let clicks = data.clicks;
        let skips = data.skips;

        if (dailyContentPerformances.has(timeKey)) {
          if (dailyContentPerformances.get(timeKey).views > views)
            views = dailyContentPerformances.get(timeKey).views;
          if (dailyContentPerformances.get(timeKey).clicks > clicks)
            clicks = dailyContentPerformances.get(timeKey).clicks;
          if (dailyContentPerformances.get(timeKey).skips > skips)
            skips = dailyContentPerformances.get(timeKey).skips;
        }

        dailyContentPerformances.set(timeKey, {
          views,
          clicks,
          skips,
        });
      }
    }
  );

  // Merge accountedDailyContentPerformances with monthlyPerformance
  dailyContentPerformances.forEach((value, key) => {
    if (
      performance.size !== undefined &&
      performance.size !== 0 &&
      performance.has(key)
    ) {
      performance.set(key, {
        views: performance.get(key).views + value.views,
        clicks: performance.get(key).clicks + value.clicks,
        skips: performance.get(key).skips + value.skips,
      });
    } else {
      try {
        performance.set(key, {
          views: value.views,
          clicks: value.clicks,
          skips: value.skips,
        });
      } catch (error) {
        performance = new Map<string, any>();
        performance.set(key, {
          views: value.views,
          clicks: value.clicks,
          skips: value.skips,
        });
      }
    }
  });

  return performance;
}
