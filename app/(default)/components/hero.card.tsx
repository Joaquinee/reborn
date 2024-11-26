export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl md:text-2xl font-bold text-center mb-4">
        {title}
      </h3>
      <p className="text-center">{description}</p>
    </div>
  );
}
