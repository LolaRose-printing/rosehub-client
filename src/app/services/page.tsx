import { NextPage } from "next";
import { Header } from "@/components/Header";
import { CreateService } from "@/components/CreateService";
import { getServices } from "@/lib/fetcher";
import { ListServices } from "@/components/ListServices";

const Page: NextPage = async () => {
  const services = await getServices();

  return (
    <main>
      <Header />
      <div className="max-w-7xl m-auto mt-12 text-center">
        <div className="flex flex-col gap-15 justify-center">
          <div>
            <CreateService />
          </div>
          <div>
            <h1 className="text-lg">Services</h1>
            <ListServices
              services={services}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
