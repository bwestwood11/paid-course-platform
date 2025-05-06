import { headers } from "next/headers";
import {
  type VideoAssetCreatedWebhookEvent,
  type VideoAssetErroredWebhookEvent,
  type VideoAssetReadyWebhookEvent,
  type VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import { mux } from "@/lib/mux";
import { db } from "@/server/db";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("Missing Mux webhook signing secret");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("Missing Mux signature", { status: 401 });
  }

  const payload = (await request.json()) as WebhookEvent;
  const body = JSON.stringify(payload);
  try {
    mux.webhooks.verifySignature(
      body,
      {
        "mux-signature": muxSignature,
      },
      SIGNING_SECRET,
    );
  } catch (error) {
    console.log("Error verifying Mux signature", error);
    return new Response("Invalid Mux signature", { status: 401 });
  }

  switch (payload.type) {
    case "video.asset.created": {
      const data = payload.data;

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      const metadata = JSON.parse(data.passthrough ?? "{}") as {
        type?: "chapter" | "trailer";
      };
      const videoType = metadata.type;

      if (videoType === "trailer") {
        await db.trailer.update({
          where: {
            muxUploadId: data.upload_id,
          },
          data: {
            muxAssetId: data.id,
            muxStatus: data.status,
          },
        });
      }
      if (videoType === "chapter") {
        await db.chapter.update({
          where: {
            muxUploadId: data.upload_id,
          },
          data: {
            muxAssetId: data.id,
            muxStatus: data.status,
          },
        });
      }
      break;
    }
    case "video.asset.ready": {
      const data = payload.data;
      const playbackId = data.playback_ids?.[0]?.id;

      if (!playbackId) {
        return new Response("No playback ID found", { status: 400 });
      }

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }
      const metadata = JSON.parse(data.passthrough ?? "{}") as {
        type?: "chapter" | "trailer";
      };
      const videoType = metadata.type;

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      if (videoType === "trailer") {
        await db.trailer.update({
          where: {
            muxUploadId: data.upload_id,
          },
          data: {
            thumbnail: thumbnailUrl,
            muxPlaybackId: playbackId,
            muxStatus: data.status,
            muxAssetId: data.id,
            previewUrl: previewUrl,
          },
        });
      }
      if (videoType === "chapter") {
        await db.chapter.update({
          where: {
            muxUploadId: data.upload_id,
          },
          data: {
            thumbnail: thumbnailUrl,
            muxPlaybackId: playbackId,
            muxStatus: data.status,
            muxAssetId: data.id,
            previewUrl: previewUrl,
            videoLength: data.duration,
          },
        });
      }
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};
