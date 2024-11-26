"use client";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const currentRoute = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { data: permission, error } = useQuery({
    queryKey: ["permissions", "navBar_auth"],
    queryFn: () => getUserPermissions(["view_dashboard"], session?.user.id),
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onMutate(variables) {
      console.log(variables);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.refresh();
    }
  }, [status, router]);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={`block w-full px-4 py-3 text-white font-bold text-lg hover:bg-gray-700 transition-colors ${
        currentRoute === href ? "border-b-2 border-white" : ""
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const renderAuthButtons = () => {
    if (!isClient) return null;

    return session?.user ? (
      <button
        className="px-4 py-2 text-white font-bold text-lg hover:text-gray-300 disabled:opacity-50"
        onClick={() => signOutMutation.mutate()}
        disabled={signOutMutation.isPending}
        id="sign-out-button"
      >
        {signOutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
      </button>
    ) : (
      <div className="flex items-center space-x-4">
        <NavLink href="/sign-in">Connexion</NavLink>
        <NavLink href="/sign-up">S&apos;enregistrer</NavLink>
      </div>
    );
  };

  return (
    <header className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image
              src="/images/v0_67.png"
              alt="Icon"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/forums">Forums</NavLink>
            <NavLink href="/staff">Staff</NavLink>
            {isClient && session?.user && (
              <>
                <NavLink href="/profil">Profil</NavLink>
                {permission && <NavLink href="/admin">Dashboard</NavLink>}
              </>
            )}
          </div>

          <div className="hidden md:block">{renderAuthButtons()}</div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">
                {isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              </span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col divide-y divide-gray-700">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/forums">Forums</NavLink>
            <NavLink href="/staff">Staff</NavLink>
            {isClient && session?.user && (
              <>
                <NavLink href="/profil">Profil</NavLink>
                {permission && <NavLink href="/admin">Dashboard</NavLink>}
              </>
            )}
            {renderAuthButtons()}
          </div>
        </div>
      )}
    </header>
  );
}
