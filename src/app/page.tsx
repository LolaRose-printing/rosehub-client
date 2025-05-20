import { NextPage } from "next";
import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <main className="text-center">
      <Header />
      <div className="flex flex-col gap-8 text-[20px] mt-12">
        <Image
          src="/peoplemarketplace.svg"
          width={600}
          height={600}
          alt="lola-logo"
          className="m-auto"
          />
        <p>To get the full experience of Rosehub follow on the link below.</p>
        <button type="button" className="bg-[#612ad5] text-sm text-white px-[24px] h-[40px] w-[400px] m-auto cursor-pointer items-center justify-center flex relative">
          <Link className="flex-1 items-center justify-center flex" href={process.env.ROSEHUB_APP!}>
            Go to Rosehub Application
          </Link>
        </button>
      </div>
    </main>
  );
}

export default Page;
