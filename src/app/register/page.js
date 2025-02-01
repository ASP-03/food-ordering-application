"use client";
import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState('');

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setCreatingUser(true);
        setError('');
        setUserCreated(false);

        // Simple form validation
        if (!email || !password) {
            setError('Email and password are required.');
            setCreatingUser(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setUserCreated(true);
                setEmail('');
                setPassword('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error has occurred. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        } finally {
            setCreatingUser(false);
        }
    }

    return (
        <section className="mt-8 p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h1 className="mb-4 text-center text-red-600 text-4xl font-bold">Welcome!</h1>

            {userCreated && (
                <div className="my-4 text-center text-green-600">
                    Registered successfully!<br />
                    Now you can{' '}
                    <Link className="underline text-blue-600" href="/login">Login &raquo;</Link>
                </div>
            )}

            {error && (
                <div className="my-4 text-center text-red-500">
                    {error}
                </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    disabled={creatingUser}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="border p-2 rounded-md"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    disabled={creatingUser}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="border p-2 rounded-md"
                    required
                />

                <button
                    type="submit"
                    disabled={creatingUser}
                    className={`p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition ${
                        creatingUser ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-busy={creatingUser}
                >
                    {creatingUser ? 'Registering...' : 'Register'}
                </button>

                <div className="mt-4 text-center text-gray-500">Or Continue with</div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-100 transition"
                >
                    <Image src="/google.jpg" alt="Google" width={24} height={24} /> 
                    Sign in with Google
                </button>

                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Already have an account?{' '}
                    <Link className="underline text-blue-600" href="/login">Login &raquo;</Link>
                </div>
            </form>
        </section>
    );
}
