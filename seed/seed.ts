import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    // Hashage du mot de passe
    const passWord = bcrypt.hashSync("admin", 10);
    const username = "admin";
    const email = "admin@admin.com";

    const adminRoles = "Administrateur";
    const adminRolesColor = "#a5b4fc";

    // Définition des permissions
    const permission_basic = [
      {
        name: "view_dashboard",
        description: "Voir le dashboard",
      },
      {
        name: "view_dashboard_users",
        description: "Voir la listes des utilisateurs",
      },
      {
        name: "view_dashboard_categories",
        description: "Voir la listes des categories",
      },

      {
        name: "view_dashboard_groups",
        description: "Voir la listes des Groupes",
      },

      {
        name: "interact_dashboard_users",
        description: "Pouvoir intéragir avec les utilisateurs",
      },

      {
        name: "interact_dashboard_categories",
        description: "Pouvoir intéragir avec les categories",
      },

      {
        name: "interact_dashboard_groups",
        description: "Pouvoir intéragir avec les Groupes",
      },
    ];

    const permissions = await Promise.all(
      permission_basic.map((permission) =>
        prisma.permissions.upsert({
          where: { name: permission.name },
          update: {},
          create: permission,
        })
      )
    );

    // Création du rôle administrateur
    const adminRole = await prisma.roles.create({
      data: {
        name: adminRoles,
        color: adminRolesColor,
        staff: true,
        rolePermissions: {
          create: permissions.map((permission) => ({
            permissionId: permission.id,
          })),
        },
      },
    });

    // Création de l'utilisateur admin
    const admin = await prisma.users.create({
      data: {
        username,
        email,
        password: passWord,
        userRoles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
