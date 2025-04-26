import { NextPage } from "next";
import { Header } from "@/components/Header";
import { getOrders } from "@/lib/fetcher";
import { ListOrders } from "@/components/ListOrders";

const Page: NextPage = async () => {
  const orders = await getOrders();

  return (
    <main>
      <Header />
      <div className="max-w-dvw m-auto mt-12 text-center">
        <div className="flex flex-col gap-15 justify-center">
          <h1 className="text-lg font-bold uppercase">Orders</h1>
          <ListOrders
            orders={orders}
          />
        </div>
      </div>
    </main>
  );
}

export default Page;
