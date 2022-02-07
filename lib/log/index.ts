import winston from "winston";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.colorize(),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
