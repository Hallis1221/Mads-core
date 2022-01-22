export default function getHistory(
  history: {
    d: { contentID: string; clicks: number; views: number; skips: number };
    t: string;
  }[],
  content: { contentID: string },
  performance: any
) {
  if (!history) return;

  let dailyContentPerformances: Map<string, any> = new Map<string, any>();

  history.forEach(
    (data: {
      d: {
        contentID: string;
        clicks: number;
        views: number;
        skips: number;
      };
      t: string;
    }) => {
      if (data.d.contentID === content.contentID) {
        // Create time key with format YYYY-MM-DD
        let timeKey = data.t.substring(0, 10);

        // Ensure we are setting data that is higher than the previous entry (so we do not overwrite new data with old data)
        let views = data.d.views;
        let clicks = data.d.clicks;
        let skips = data.d.skips;

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

  // Ensure dailyContentPerformances is accounted for the fact that each day has the total and not just the total for the day by subtracting the last day's data from the current day's data, if there is data for the previous day
  let accountedDailyContentPerformances: Map<string, any> =
    dailyContentPerformances;

  accountedDailyContentPerformances.forEach((value, key) => {
    let day: string | number = parseInt(key.split("-")[2]) - 1;
    let month: string | number = parseInt(key.split("-")[1]);
    let year = parseInt(key.split("-")[0]);

    // Ensure day and month always have 2 digits
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    let previousDayData = accountedDailyContentPerformances.get(
      `${year}-${month}-${day}`
    );

    if (!previousDayData) return;
    // Ensure the data we are subtracting is not undefined nor higher than the current day's data
    if (value.views < previousDayData.views)
      value.views += previousDayData.views;

    if (value.clicks < previousDayData.clicks)
      value.clicks += previousDayData.clicks;

    if (value.skips < previousDayData.skips)
      value.skips += previousDayData.skips;

    accountedDailyContentPerformances.set(key, {
      views: value.views - previousDayData.views,
      clicks: value.clicks - previousDayData.clicks,
      skips: value.skips - previousDayData.skips,
    });
  });

  // Merge accountedDailyContentPerformances with monthlyPerformance
  accountedDailyContentPerformances.forEach((value, key) => {
    if (performance.has(key)) {
      performance.set(key, {
        views: performance.get(key).views + value.views,
        clicks: performance.get(key).clicks + value.clicks,
        skips: performance.get(key).skips + value.skips,
      });
    } else {
      performance.set(key, {
        views: value.views,
        clicks: value.clicks,
        skips: value.skips,
      });
    }
  });

  return performance;
}
