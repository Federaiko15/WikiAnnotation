import { NextRequest, NextResponse } from "next/server";
import { userDataSchema } from "@/lib/auth/schemas/userDataSchema";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = userDataSchema.parse(body);

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const isEmailTaken =
        existingUser.email.toLowerCase() === email.toLowerCase();
      return NextResponse.json(
        {
          message: isEmailTaken
            ? "Esiste già un utente associato a questa email..."
            : "Questo nome utente è già in uso...",
        },
        {
          status: 409,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message:
            error.issues[0]?.message ||
            "I dati inseriti non rispettano i requisiti di validazione.",
        },
        { status: 400 },
      );
    }

    console.error("Errore durante la registrazione:", error);
    return NextResponse.json(
      {
        message:
          "Errore rilevato durante la registrazione di un nuovo utente...",
      },
      { status: 500 },
    );
  }
}
