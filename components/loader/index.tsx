import { Loader2 } from "lucide-react";

export default function LoaderCustom() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        <Loader2 className="w-16 h-16 animate-spin text-gray-800 dark:text-gray-200" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Chargement...
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Veuillez patienter pendant que nous préparons votre contenu.
        </p>
      </div>
    </div>
  );
}
