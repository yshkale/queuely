import { EmptyQueue } from "@/components/EmptyQueue";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <Header />
      <main className="px-4 md:px-20 py-8 md:py-10 space-y-4">
        <Navigation />

        <EmptyQueue />
      </main>
    </>
  );
}
