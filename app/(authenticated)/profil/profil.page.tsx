"use client";

import LoaderCustom from "@/components/loader";
import NavBar from "@/components/navbar";
import { updateUserSchema } from "@/lib/zod/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Save, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  confirmPassword,
  getUserProfile,
  updateUserAvatar,
} from "./profil.actions";

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export default function ProfilEdit() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: session, update } = useSession();

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UpdateUserType>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const updateAvatarMutation = useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: async (newAvatarPath) => {
      setImagePreview(newAvatarPath.path);
      await update({
        ...session,
        user: {
          ...session?.user,
          image: newAvatarPath.path,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: confirmPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  if (isLoading) return <LoaderCustom />;
  if (isError)
    return <div>Erreur lors du chargement du profil utilisateur</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (selectedFile && imagePreview) {
        await updateAvatarMutation.mutateAsync(selectedFile);
        return;
      }

      const formData = new FormData(event.target as HTMLFormElement);
      await updatePasswordMutation.mutateAsync(formData);
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 text-center">
              <h2 className="text-2xl font-semibold">Modifier le profil</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={
                      imagePreview ||
                      `/api/avatars/${user?.avatar}` ||
                      "/uploads/images/avatars/v0_57.png"
                    }
                    alt="Avatar"
                    fill
                    objectFit="cover"
                    className="rounded-full"
                    priority
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </label>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleImageChange}
                  className="hidden"
                  id="avatar-upload"
                />
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="current_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mot de passe actuel
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      placeholder="Entrez votre mot de passe actuel"
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      placeholder="Entrez votre nouveau mot de passe"
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="new_password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="password"
                      id="new_password_confirmation"
                      name="new_password_confirmation"
                      placeholder="Confirmez votre nouveau mot de passe"
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    disabled={
                      updatePasswordMutation.isPending ||
                      updateAvatarMutation.isPending
                    }
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Save
                        className="h-5 w-5 text-white group-hover:text-gray-300"
                        aria-hidden="true"
                      />
                    </span>
                    {updatePasswordMutation.isPending ||
                    updateAvatarMutation.isPending
                      ? "Enregistrement en cours..."
                      : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>

              {(updatePasswordMutation.isError ||
                updateAvatarMutation.isError) && (
                <div
                  className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  role="alert"
                >
                  <p className="font-bold">Erreur</p>
                  <p>
                    {updatePasswordMutation.error?.message ||
                      updateAvatarMutation.error?.message}
                  </p>
                </div>
              )}

              {(updatePasswordMutation.isSuccess ||
                updateAvatarMutation.isSuccess) && (
                <div
                  className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                  role="alert"
                >
                  <p className="font-bold">Succès</p>
                  <p>Les modifications ont été enregistrées avec succès.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
