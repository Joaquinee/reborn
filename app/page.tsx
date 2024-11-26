import Hero from "@/app/(default)/hero";
import Navbar from "@/components/navbar";

export default async function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
