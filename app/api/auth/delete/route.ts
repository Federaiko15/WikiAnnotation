import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import z from "zod";

const deleteSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = deleteSchema.parse(body);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Non esiste un utente con questa email",
        },
        {
          status: 409,
        },
      );
    }

    const isPassCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPassCorrect) {
      return NextResponse.json(
        {
          message: "Errore nella password",
        },
        {
          status: 400,
        },
      );
    }

    await User.deleteOne({ email });
    return NextResponse.json(
      {
        message: "Utente eliminato con successo",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Errore durante l'eliminazione dei dati dell'utente",
      },
      {
        status: 500,
      },
    );
  }
}
