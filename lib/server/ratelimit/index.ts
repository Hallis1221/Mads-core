import RatelimiterDB from "../../db/models/auth/ratelimit";
import { logger } from "../../log";

export async function isContentRateLimited(
  contentID: string,
  ip: string,
  action: string
) {
  let contentRateLimited = false;

  // Check if the contentID is found in the ratelimiter database
  const contentRateLimit = await RatelimiterDB.findOne({
    id: contentID,
  });
  // If the createdAt is older than 10 minutes, delete the rate limit
  if (
    contentRateLimit &&
    contentRateLimit.createdAt &&
    contentRateLimit.createdAt < Date.now() - 600000
  ) {
    await RatelimiterDB.deleteOne({
      id: contentID,
    });

    logger.warn(
      `Rate limit for contentID ${contentID} has been deleted because it is older than 10 minutes.`
    );
  } else if (contentRateLimit) {
    // Check if the ip is found in the ratelimiter database
    contentRateLimit.ips.forEach(
      (ipRateLimit: { ip: string; action: [string] }) => {
        if (ipRateLimit.ip === ip) {
          ipRateLimit.action.forEach((actionRateLimit: string) => {
            if (actionRateLimit === action) {
              contentRateLimited = true;
            }
          });

          if (contentRateLimited) {
            logger.debug(`${ip} is rate limited for ${action} on content ${contentID}`);

            return contentRateLimited;
          } else {
            // Rate limit the action
            ipRateLimit.action.push(action);
            contentRateLimit.save();
          }
        }
      }
    );
  } else {
    // Log that the contentID is not found in the ratelimiter database
    logger.warn(
      `ContentID: ${contentID} is not found in the ratelimiter database`
    );

    // Create the contentID in the ratelimiter database
    await RatelimiterDB.create({
      id: contentID,
      ips: [
        {
          ip,
          action,
        },
      ],
    }).catch((error) => {
      // Log the error
      logger.error(error);
    });
  }
  return contentRateLimited;
}

export async function isAdRateLimited(
  adID: string,
  ip: string,

  action: string
) {
  let adRateLimited = false;
  // Check if the adID is found in the ratelimiter database
  const adRateLimit = await RatelimiterDB.findOne({
    id: adID,
  });

  // If the createdAt is older than 10 minutes, delete the rate limit
  if (
    adRateLimit &&
    adRateLimit.createdAt &&
    adRateLimit.createdAt < Date.now() - 600000
  ) {
    await RatelimiterDB.deleteOne({
      id: adID,
    });
  } else if (adRateLimit) {
    // Check if the ip is found in the ratelimiter database
    adRateLimit.ips.forEach((ipRateLimit: { ip: string; action: [string] }) => {
      if (ipRateLimit.ip === ip) {
        ipRateLimit.action.forEach((actionRateLimit: string) => {
          if (actionRateLimit === action) {
            adRateLimited = true;
          }
        });

        if (adRateLimited) {
          logger.debug(`${ip} is rate limited for ${action} on ad ${adID}`);

          return adRateLimited;
        } else {
          // Rate limit the action
          ipRateLimit.action.push(action);
          adRateLimit.save();
        }
      }
    });
  } else {
    // Log that the adID is not found in the ratelimiter database
    logger.warn(`AdID: ${adID} is not found in the ratelimiter database`);

    // Create the adID in the ratelimiter database
    await RatelimiterDB.create({
      id: adID,
      ips: [
        {
          ip,
          action,
        },
      ],
    }).catch((error) => {
      // Log the error
      logger.error(error);
    });
  }
  return adRateLimited;
}
