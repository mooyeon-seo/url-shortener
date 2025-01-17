import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from './themeSwitcher';

const Navigation = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 w-full bg-primary shadow-md z-50 flex justify-between items-center p-2">
            <div className="text-xl font-bold">
                <Link href="/">URL Shortener</Link>
            </div>
            <div className="space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                    Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900">
                    About
                </Link>
                <ThemeSwitcher />
            </div>
        </nav>
    );
};

export default Navigation;