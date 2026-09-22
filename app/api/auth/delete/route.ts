import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import z from "zod";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

const deleteSchema = z.object({
  email: z.string().email("Formato email non valido"),
  password: z.string().min(1, "La password è obbligatoria"),
});

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Non autorizzato. Effettua l'accesso prima di procedere.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();
    const { email, password } = deleteSchema.parse(body);

    if (session.user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        {
          message: "Non sei autorizzato a eliminare questo account.",
        },
        {
          status: 403,
        },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Non esiste un utente associato a questa email",
        },
        {
          status: 404,
        },
      );
    }

    const isPassCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPassCorrect) {
      return NextResponse.json(
        {
          message: "Password non corretta",
        },
        {
          status: 401,
        },
      );
    }

    await User.deleteOne({ email: email.toLowerCase() });

    return NextResponse.json(
      {
        message: "Account eliminato con successo",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message || "Dati inseriti non validi.",
        },
        {
          status: 400,
        },
      );
    }

    console.error("Errore eliminazione utente:", error);
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
