'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PseudonymPage() {
  const [pseudonym, setPseudonym] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('anon_user'));
    if (user?.pseudonym) {
      router.replace('/'); // Already signed in, redirect to homepage
    }
  }, [router]);

  function handleSubmit(e) {
    e.preventDefault();

    if (pseudonym.trim().length < 3) {
      setError('Pseudonym must be at least 3 characters.');
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      pseudonym: pseudonym.trim(),
    };

    localStorage.setItem('anon_user', JSON.stringify(user));
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Choose a Pseudonym</h2>
        <input
          type="text"
          value={pseudonym}
          onChange={(e) => setPseudonym(e.target.value)}
          placeholder="e.g. MysticWriter123"
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
