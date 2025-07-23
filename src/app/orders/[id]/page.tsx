import { notFound } from "next/navigation";
import OrderDetails from "../../../components/OrderDetails";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  const token = (await cookies()).get("auth")?.value;

  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  });
  const requestInit: RequestInit = {
    headers,
    cache: "no-store",
    method: "get",
    mode: "cors",
  };
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${id}`);
  const request = new Request(url, requestInit);
  const res = await fetch(request);

  if (!res.ok) return notFound();

  const order = await res.json();

  return <OrderDetails order={order} />;
}