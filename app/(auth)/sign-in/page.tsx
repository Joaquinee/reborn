"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: async () => {
      toast.success("Connexion réussie");
      router.refresh();
      router.push("/");
    },
    onError: (error: Error) => {
      setErrorMessage("Email ou mot de passe incorrect.");
      toast.error("Échec de la connexion");
    },
  });

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    mutation.mutate({ email, password });
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 text-center">
              <h2 className="text-2xl font-semibold">Connexion</h2>
            </div>
            <div className="px-6 py-8 space-y-6">
              {errorMessage && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block h-10 w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                        placeholder="m@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mot de passe
                    </Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block h-10 w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 text-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-gray-800 focus:ring-gray-700 border-gray-300 rounded"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-gray-600 hover:text-gray-500"
                    >
                      J&apos;ai oublié mon mot de passe
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Chargement...
                      </span>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
