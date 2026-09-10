"use server";

import { NextRequest, NextResponse } from "next/server";
import { userDataSchema } from "@/lib/auth/schemas/userDataSchema";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = userDataSchema.parse(body);
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Esiste già un utente associato a questa email...",
        },
        {
          status: 401,
        },
      );
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    return NextResponse.json(
      {
        message: "Utente correttamente registrato!",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Errore rilevato durante la registrazione di un nuovo utente...",
      },
      { status: 500 },
    );
  }
}
