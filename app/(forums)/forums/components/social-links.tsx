export default function SocialLinks() {
  const socialNetworks = [
    { name: "Discord", icon: "🎮", href: "#" },
    { name: "Youtube", icon: "📺", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4">
        <h2 className="text-xl font-semibold">Réseaux sociaux</h2>
      </div>
      <div className="p-4 space-y-4">
        {socialNetworks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
          >
            <span className="text-2xl">{social.icon}</span>
            <span className="font-medium">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
