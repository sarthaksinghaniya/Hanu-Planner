import { NextResponse } from "next/server";

// This route is marked as static for static exports
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}

// For static exports, we need to provide a default export
export default function handler() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}