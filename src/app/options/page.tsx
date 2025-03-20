import { NextPage } from "next";
import { Settings } from "@/components/Settings";
import { Header } from "@/components/Header";

const Page: NextPage = async () => {
  return (
    <main>
      <Header />
      <div className="mt-12 ml-12 text-center">
        <div className="flex flex-row rounded">
          <Settings />
        </div>
      </div>
    </main>
  );
}

export default Page;
