import config from "@/lib/config";
import ImageKit from "@imagekit/nodejs";
import { NextResponse } from "next/server";

const {
  env: {
    imageKit: { privateKey },
  },
} = config;

const imageKit = new ImageKit({
  privateKey,
});

export async function GET() {
  return NextResponse.json(imageKit.helper.getAuthenticationParameters());
}
