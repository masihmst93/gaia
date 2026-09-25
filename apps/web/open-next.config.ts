import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

const isPullRequestPreview = process.env.IS_PR === "true";

export default defineCloudflareConfig(
  isPullRequestPreview
    ? {
        // PR previews are render checks only. Keep them self-contained so a
        // brand-new Cloudflare account does not need the production R2/DO
        // resources before the first preview can exist.
        incrementalCache: staticAssetsIncrementalCache,
        enableCacheInterception: true,
      }
    : {
        // Production keeps the durable R2 + DO revalidation setup.
        incrementalCache: withRegionalCache(r2IncrementalCache, {
          mode: "long-lived",
        }),
        queue: doQueue,
        enableCacheInterception: true,
      },
);
