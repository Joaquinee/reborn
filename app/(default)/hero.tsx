import { Code, Shield, Users } from "lucide-react";
import FeatureCard from "./components/hero.card";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center mt-20  text-white px-4 py-12"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-2">
        San Andreas Reborn
      </h1>
      <h2 className="text-xl md:text-3xl text-center mb-12">
        La renaissance du roleplay
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <FeatureCard
          icon={<Users className="w-12 h-12" />}
          title="S.A Reborn"
          description="San Andreas Reborn est un serveur multijoueur basé sur la plateforme Multi Theft Auto. Nous avons pour but de réunir l'ancienne communauté et d'accueillir les nouveaux joueurs."
        />
        <FeatureCard
          icon={<Shield className="w-12 h-12" />}
          title="Administration"
          description="Notre équipe d'administration est disponible pour vous aider avec vos problèmes et répondre à vos questions pour vous apporter une meilleure expérience de jeu."
        />
        <FeatureCard
          icon={<Code className="w-12 h-12" />}
          title="Scripts"
          description="Notre équipe de développement fait de son mieux afin d'améliorer une expérience de jeu sans dérapage, même pour les petits PC gagnant ainsi sans lags !"
        />
      </div>
    </section>
  );
}
