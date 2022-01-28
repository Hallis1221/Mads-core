import {
  getContentDataHistory,
  getOldContentDataHistory,
} from "../../requests/backend";
import { getCreatorPerformance } from "../../requests/frontend";
import getHistory from "../getHistory";
import createChartData from "../createChartData";

export default async function getAllContent(
  setLastUpdated: (arg0: string) => void,
  setStats: (arg0: {
    views: any;
    clicks: any;
    skips: any;
    chartData: any[];
  }) => void,
  setContents: (arg0: any) => void
) {
  await getCreatorPerformance().then(async (res) => {
    let creatorPerformance = res.getUserContentPerformances;
    if (!creatorPerformance) {
      console.log("Returning as creatorPerformance is undefined");
      return;
    }

    let monthlyPerformance: Map<string, any> = new Map<string, any>();
    let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();

    let lastUpdated = "";
    let stats = {
      views: 0,
      clicks: 0,
      skips: 0,
      chartData: Array<any>(),
    };

    let contents: {
      views: number;
      clicks: number;
      skips: number;
      contentID: string;
    }[] = [];

    for (let i = 0; i < creatorPerformance.length; i++) {
      let content = creatorPerformance[i];
      contents.push(content);
      console.log(content.contentID);

      let contentDataHistory = await getContentDataHistory(
        content.contentID,
        undefined
      );

      monthlyPerformance = await getHistory(
        contentDataHistory,
        content,
        monthlyPerformance
      );

      let totalViews = contents.length;
      let totalClicks = contents.length;
      let totalSkips = contents.length;

      monthlyPerformance.forEach((value) => {
        totalViews += value.views;
        totalClicks += value.clicks;
        totalSkips += value.skips;
      });

      let chartData = createChartData(
        monthlyPerformance,
        oldMonthlyPerformance
      );

      lastUpdated = new Date().toLocaleString();

      setContents(contents);
      // setStats
      stats = {
        views: totalViews,
        clicks: totalClicks,
        skips: totalSkips,
        chartData,
      };

      /*
      getOldContentDataHistory(content.contentID, undefined).then(
        (contentDataHistory) => {
          oldMonthlyPerformance = getHistory(
            contentDataHistory,
            content,
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

          let chartData = createChartData(
            monthlyPerformance,
            oldMonthlyPerformance
          );

          // setStats
          setStats({
            views: totalViews,
            clicks: totalClicks,
            skips: totalSkips,
            chartData,
          });
        }
      );*/
    }
    console.log("Got all content");
    setLastUpdated(lastUpdated);
    setStats(stats);
  });
}
