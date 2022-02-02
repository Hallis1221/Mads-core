
export default function createChartData(
    dailyHistory: Map<String, { views: number; clicks: number; skips: number }>,
    oldDailyHistory: Map<String, { views: number; clicks: number; skips: number }>
  ): Array<any> {
    let cd: any = [];
  
    for (let key of Array.from(dailyHistory.keys())) {
      let last = oldDailyHistory.get(key as string);
      let now = dailyHistory.get(key as string);
  
      let map: {
        now: { views: number; clicks: number; skips: number; date: String };
        last: { views: number; clicks: number; skips: number };
      } = {
        now: {
          views: 0,
          clicks: 0,
          skips: 0,
          date: key.split("-")[2].toString() + "th",
        },
        last: { views: 0, clicks: 0, skips: 0 },
      };
  
      if (now) {
        map.now = {
          views: now.views,
          clicks: now.clicks,
          skips: now.skips,
          date: key.split("-")[2].toString() + "th",
        };
      }
  
      if (last) {
        map.last = {
          views: last.views,
          clicks: last.clicks,
          skips: last.skips,
        };
      }
  
      cd.push(map);
    }
  
    return cd;
  }