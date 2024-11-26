"use client";

import NavBar from "@/components/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPasswordAction } from "./reset.action";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (formData: FormData) => {
    const response = await resetPasswordAction(formData, token);

    if (response.error) {
      setError(response.error as string);
    } else {
      setSuccess(response.success as string);
      setError(null);
      router.push("/sign-in");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center mt-20 bg-white text-white px-4 py-12 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden m:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 text-center">
            <h2 className="text-xl font-semibold">
              Réinitialiser le mot de passe
            </h2>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <div className="flex items-center">
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
                handleResetPassword(formData);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Réinitialiser le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
