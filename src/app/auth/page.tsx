import { NextPage } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignIn } from "@/components/SignIn";

const Page: NextPage = async () => {
  const token = (await cookies()).get("auth")?.value;

  if (token) {
    redirect("/");
  }

  return <SignIn />;
}

export default Page;
