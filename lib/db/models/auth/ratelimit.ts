import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const RateLimitSchema = new mongoose.Schema({
  // The timestamp the rate limit was created
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // The id of the content / ad
  id: {
    type: String,
    required: true,
  },

  // Array of IP addresses that have been rate limited
  ips: {
    type: [
      {
        action: {
          type: [String],
          required: true,
        },

        ip: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
});

const RatelimiterDB =
  mongoose.models.Ratelimiter || mongoose.model("Ratelimiter", RateLimitSchema);
export default RatelimiterDB;
