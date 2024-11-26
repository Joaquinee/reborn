import { Loader2 } from "lucide-react";

export default function ForumContentLoader() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="h-10 w-48 bg-gray-800 rounded animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 space-y-4"
              >
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-100 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
