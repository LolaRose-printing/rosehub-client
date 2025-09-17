import UpdateServiceForm from '../UpdateServiceForm';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  // Add all fields your API returns
}

async function fetchService(slug: string): Promise<Service> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // optional static token
    },
  });

  if (!res.ok) throw new Error('Failed to fetch service');

  return res.json();
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  let service: Service | null = null;

  try {
    service = await fetchService(slug);
  } catch (err) {
    console.error(err);
    return <div>Error loading service.</div>;
  }

  return (
    <div>
      <h1>Edit Service: {service.name}</h1>
      <UpdateServiceForm service={service} slug={slug} />
    </div>
  );
}
