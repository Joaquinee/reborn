"use client";

import NavBar from "@/components/navbar";
import { StaffRoleWithUsers } from "@/interfaces";
import CardOnline from "@/task/online/CardOnline";
import Image from "next/image";
export default function StaffPage({
  listStaff,
}: {
  listStaff: StaffRoleWithUsers[];
}) {
  return (
    <>
      <NavBar />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Équipe du staff
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Staff Section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-800 text-white p-4">
                  <h2 className="text-lg font-semibold">Staff</h2>
                </div>
                <div className="p-6 space-y-8">
                  {listStaff.map((role) => (
                    <div key={role.name} className="space-y-4">
                      <h3 className="font-semibold text-gray-800">
                        {role.name}:
                      </h3>
                      <div className="space-y-2">
                        {role.users.map(
                          (admin: { username: string; avatar: string }) => (
                            <div
                              key={admin.username}
                              className="flex items-center gap-3 pl-4"
                            >
                              <Image
                                src={
                                  `/api/avatars/${admin.avatar}` ||
                                  "/uploads/images/avatars/v0_57.png"
                                }
                                alt={admin.username}
                                width={32}
                                height={32}
                                className="rounded-full"
                                style={{ width: "32px", height: "32px" }}
                              />
                              <span className="text-gray-700">
                                {admin.username}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <CardOnline />

              {/* Social Networks */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-800 text-white p-4">
                  <h2 className="text-lg font-semibold">Réseaux sociaux</h2>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { name: "Discord", icon: "🎮" },
                    { name: "Youtube", icon: "📺" },
                    { name: "Twitter", icon: "🐦" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <span>{social.icon}</span>
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
