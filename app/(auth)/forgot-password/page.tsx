"use client";

import NavBar from "@/components/navbar";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { sendForgotPassword } from "./forgot.action";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleForgotPassword = async (formData: FormData) => {
    const response = await sendForgotPassword(formData);

    if (response.error) {
      setError(response.error as string);
      console.error(
        "Erreur de réinitialisation du mot de passe :",
        response.error
      );
    } else {
      setError(null);
      setSuccess(response.success as string);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center mt-20 text-white px-4 py-12 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden m:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 text-center">
            <h2 className="text-xl font-semibold">Mot de passe oublié</h2>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4  rounded relative mt-1 p-3"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{success}</span>
              </div>
            </div>
          )}
          <div className="p-4 space-y-4">
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleForgotPassword(formData);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                      placeholder="Adresse email"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                  Réinitialiser le mot de passe
                </button>
              </div>
            </form>
            <div className="text-sm text-center mt-4">
              <Link
                href="/sign-in"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
