import { getContentDataHistory, getOldContentDataHistory } from "../../requests/backend";
import { getCreatorPerformance } from "../../requests/frontend";
import getHistory  from "../getHistory";
import createChartData from "../createChartData";

export default function getAllContent(setLastUpdated: (arg0: string) => void, setStats: (arg0: { views: number; clicks: number; skips: number; chartData: any[]; }) => void) {
    getCreatorPerformance().then((res) => {
        let creatorPerformance = res.getUserContentPerformances;
        if (!creatorPerformance) return;
  
        let monthlyPerformance: Map<string, any> = new Map<string, any>();
        let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();
  
        creatorPerformance.forEach(
          (content: {
            views: number;
            clicks: number;
            skips: number;
            contentID: string;
          }) => {
            getContentDataHistory(content.contentID, undefined).then(
              (contentDataHistory) => {
                monthlyPerformance = getHistory(
                  contentDataHistory,
                  content,
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
  
                let chartData = createChartData(
                  monthlyPerformance,
                  oldMonthlyPerformance
                );
  
                let lastUpdated = new Date().toLocaleString();
                setLastUpdated(lastUpdated);
                  
                // setStats
                setStats({
                  views: totalViews,
                  clicks: totalClicks,
                  skips: totalSkips,
                  chartData,
                });
              }
            );
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
            );
          }
        );
      });
}