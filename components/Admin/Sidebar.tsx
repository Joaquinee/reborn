"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/v0_67.png";
import {
  ArrowLeft,
  Folder,
  Home,
  LogOut,
  Menu,
  Users,
  UsersRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Retour", href: "/", icon: ArrowLeft },
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Catégories", href: "/admin/categories", icon: Folder },
  { name: "Groupes", href: "/admin/groups", icon: UsersRound },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            pathname === item.href
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-blue-600",
            "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
            mobile && "w-full"
          )}
          onClick={onItemClick}
        >
          <item.icon
            className={cn(
              pathname === item.href
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-blue-600",
              "mr-3 flex-shrink-0 h-5 w-5"
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile navbar */}
      <div className="md:hidden">
        <header className="bg-background shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <Image
                    alt="RebornRP's Logo"
                    src={Logo}
                    className="h-8 w-auto"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
              <div className="flex items-center">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" aria-label="Open menu">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <Link href="/" className="-m-1.5 p-1.5">
                          <Image
                            alt="RebornRP's Logo"
                            src={Logo}
                            className="h-8 w-auto"
                            width={50}
                            height={50}
                          />
                        </Link>
                      </div>
                      <nav className="flex flex-col gap-2">
                        <NavLinks mobile onItemClick={() => setOpen(false)} />
                      </nav>
                      <div className="mt-auto pb-4">
                        <div className="flex items-center">
                          <Avatar>
                            <AvatarImage
                              src={session?.user?.image || undefined}
                              alt={session?.user?.name || "User"}
                            />
                            <AvatarFallback>
                              {session?.user?.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {session?.user?.name}
                            </p>
                          </div>
                          <Button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                            aria-label="Sign out"
                          >
                            <LogOut className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4 mb-5">
                <Link href="/">
                  <Image
                    alt="RebornRP's Logo"
                    src={Logo}
                    className="h-8 w-auto"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
              <nav className="flex-1 space-y-1 bg-white px-2">
                <NavLinks />
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <Avatar>
                  <AvatarImage
                    src={
                      `/api/avatars/${session?.user?.avatar}` ||
                      "/uploads/images/avatars/v0_57.png"
                    }
                    alt={session?.user?.username || "User"}
                  />
                  <AvatarFallback>
                    {session?.user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {session?.user?.username}
                  </p>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
