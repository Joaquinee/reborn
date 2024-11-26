import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, online } = await req.json();

    const verifUser = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: { id: true },
    });

    if (!verifUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 401 }
      );
    }
    const allusers = await prisma.users.updateMany({
      where: { id: verifUser.id },
      data: { isOnline: online, lastSeen: new Date() },
    });

    if (allusers) {
      return NextResponse.json({ status: 200 });
    }
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état en ligne:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      where: { isOnline: true },
      select: { id: true, username: true, avatar: true },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs en ligne:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
