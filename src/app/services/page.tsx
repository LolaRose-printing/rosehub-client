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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Services</h1>
            <div className="text-sm text-gray-400">
              {services.length} {services.length === 1 ? 'service' : 'services'} found
            </div>
          </div>
          <div>
            <CreateService />
          </div>
          {services.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-300">No services found</h2>
              <p className="mt-2 text-gray-500">Your services will appear here</p>
            </div>
          ) : (
            <ListServices
              services={services}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;
