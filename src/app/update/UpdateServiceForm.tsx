'use client';

import { useState } from 'react';
import { getCookie } from 'cookies-next';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Props {
  service: Service;
  slug: string;
}

export default function UpdateServiceForm({ service, slug }: Props) {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    price: service.price,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/update/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('auth')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update service');

      alert('Service updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div>
        <label>Price:</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Service'}
      </button>
    </form>
  );
}
