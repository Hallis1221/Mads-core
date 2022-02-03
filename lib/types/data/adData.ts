import { AdMAtch } from "../match";

export type AdData = {
    // The ad's id (ADID)
    adID: string;

    // The amount of clicks the ad has received
    clicks: number;

    // The amount of views the ad has received
    views: number;

    // The amount of skips the ad has received
    skips: number;

    // The matches for the ad
    matches: Array<AdMAtch>;
}