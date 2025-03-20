import { CreateToken } from "@/components/CreateToken";
import { Header } from "@/components/Header";
import { ListTokens } from "@/components/ListTokens";
import { Settings } from "@/components/Settings";
import { getTokens } from "@/lib/fetcher";
import { NextPage } from "next";

const Page: NextPage = async () => {
  const tokens = await getTokens();

  return (
      <main>
        <Header />
        <div className="m-auto px-12 py-12 text-center">
          <div className="flex flex-row rounded items-center gap-42">
            <Settings />
            <div className="flex flex-col gap-12">
              <CreateToken />
              <div>
              <h1 className="text-lg">Tokens</h1>
              <ListTokens
                tokens={tokens}
              />
           </div>
            </div>
          </div>
        </div>
      </main>
    );
}

export default Page;
