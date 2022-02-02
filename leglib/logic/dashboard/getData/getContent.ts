
import getHistory from "../getHistory";
import createChartData from "../createChartData";

export default function getContent(
  setLastUpdated: (arg0: string) => void,
  setStats: (arg0: {
    views: any;
    clicks: any;
    skips: any;
    chartData: any[];
  }) => void,
  contentID: string
) {
  let monthlyPerformance: Map<string, any> = new Map<string, any>();
  let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();

  getContentDataHistory(contentID, undefined).then((contentDataHistory) => {  
    monthlyPerformance = getHistory(
      contentDataHistory,
      { contentID },
      monthlyPerformance
    );
    // Add up all the monthly data to get the total views, clicks, and skips
    let totalViews = 0;
    let totalClicks = 0;
    let totalSkips = 0;

    monthlyPerformance.forEach((value) => {
      totalViews += value.views;
      totalClicks += value.clicks;
      totalSkips += value.skips;
    });

    let chartData = createChartData(monthlyPerformance, oldMonthlyPerformance);

    let lastUpdated = new Date().toLocaleString();
    setLastUpdated(lastUpdated);

    // setStats
    setStats({
      views: totalViews,
      clicks: totalClicks,
      skips: totalSkips,
      chartData,
    });
  });
  getOldContentDataHistory(contentID, undefined).then((contentDataHistory) => {
    oldMonthlyPerformance = getHistory(
      contentDataHistory,
      { contentID },
      oldMonthlyPerformance
    );

    // Add up all the monthly data to get the total views, clicks, and skips
    let totalViews = 0;
    let totalClicks = 0;
    let totalSkips = 0;

    monthlyPerformance.forEach((value) => {
      totalViews += value.views;
      totalClicks += value.clicks;
      totalSkips += value.skips;
    });

    let chartData = createChartData(monthlyPerformance, oldMonthlyPerformance);

    // setStats
    setStats({
      views: totalViews,
      clicks: totalClicks,
      skips: totalSkips,
      chartData,
    });
  });
}
