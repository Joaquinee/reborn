"use client";

import NavBar from "@/components/navbar";
import { AlertCircle, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "./sign-up.actions";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      password_confirmation: formData.get("password_confirmation") as string,
      username: formData.get("username") as string,
    };

    if (data.password !== data.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const response = await signUp(data);
    if ("error" in response) {
      setError(
        typeof response.error === "string"
          ? response.error
          : "Une erreur est survenue"
      );
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center mt-20 text-white px-4 py-12 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden m:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 text-center">
            <h2 className="text-xl font-semibold">S&apos;enregistrer</h2>
          </div>
          <div className="p-4 space-y-4">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSignUp(formData);
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="block h-10 w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom d&apos;utilisateur
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="block h-10 w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="block h-10 w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmation du mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    required
                    className="block h-10 w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                  S&apos;enregistrer
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Déjà inscrit ?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/sign-in"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
