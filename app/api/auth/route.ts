"use server";

import { NextRequest, NextResponse } from "next/server";
import { userDataSchema } from "@/lib/auth/schemas/userDataSchema";

export default async function POST(request: NextRequest) {
  try {
    const { username, email, password } = userDataSchema.parse(request);
  } catch (error) {}
}
