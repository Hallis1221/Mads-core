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
  await getCreatorPerformance().then((res) => {
    let creatorPerformance = res.getUserContentPerformances;
    if (!creatorPerformance) return;

    let monthlyPerformance: Map<string, any> = new Map<string, any>();
    let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();
    let contents: {
      views: number;
      clicks: number;
      skips: number;
      contentID: string;
    }[] = [];

    creatorPerformance.forEach(
      (content: {
        views: number;
        clicks: number;
        skips: number;
        contentID: string;
      }) => {
        setStats({
          views: content.views,
          clicks: content.clicks,
          skips: content.skips,
          chartData: [],
        })
        contents.push(content);
        getContentDataHistory(content.contentID, undefined).then(
          (contentDataHistory) => {
            monthlyPerformance = getHistory(
              contentDataHistory,
              content,
              monthlyPerformance
            );
            // Add up all the monthly data to get the total views, clicks, and skips
            // Start at one for each content to account for data innaccuracy.
            // TODO fix data innaccuracy in the backend
            let totalViews = contents.length;
            let totalClicks = contents.length;
            let totalSkips = contents.length;

            monthlyPerformance.forEach((value) => {
              totalViews += value.views;
              totalClicks += value.clicks;
              totalSkips += value.skips;
              setStats({
                views: totalViews,
                clicks: totalClicks,
                skips: totalSkips,
                chartData: createChartData(
                  monthlyPerformance,
                  oldMonthlyPerformance
                ),
              });
            });

            let chartData = createChartData(
              monthlyPerformance,
              oldMonthlyPerformance
            );

            let lastUpdated = new Date().toLocaleString();
            setLastUpdated(lastUpdated);

            setContents(contents);
            // setStats
            setStats({
              views: totalViews,
              clicks: totalClicks,
              skips: totalSkips,
              chartData,
            });
          }
        );
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
    );
  });
  console.log("getAllContent");
}
