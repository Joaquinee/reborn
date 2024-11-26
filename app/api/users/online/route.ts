import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = 30;

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      where: {
        isOnline: true,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "Aucun utilisateur en ligne trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs en ligne:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
