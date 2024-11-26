import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileText,
  MessageSquare,
  MinusIcon,
  Users,
} from "lucide-react";
import { getStats } from "./action";

export default async function AdminHome() {
  const stats = await getStats();

  const iconMap = {
    users: Users,
    comments: MessageSquare,
    posts: FileText,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Tableau de bord administrateur
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => {
          const Icon = iconMap[key as keyof typeof iconMap] || Users;
          const isPositive = parseFloat(value.pourcentage.toString()) > 0;
          return (
            <Card key={key} className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50 px-4 py-3">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-5">
                <div className="text-3xl font-semibold text-gray-900 mb-2">
                  {value.actuel}
                </div>
                <div
                  className={`text-sm flex items-center ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {parseFloat(value.pourcentage.toString()) > 0 ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : parseFloat(value.pourcentage.toString()) < 0 ? (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <MinusIcon className="w-4 h-4 mr-1" />
                  )}
                  <span>
                    {Math.abs(parseFloat(value.pourcentage.toString()))}%
                  </span>
                  <span className="text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
