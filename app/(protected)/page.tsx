import ChoosePages from "../../components/ChoosePages";
import Carousel from "@/components/Carousel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }
  return (
    <main>
      <ChoosePages />
      <Carousel />
    </main>
  );
}
