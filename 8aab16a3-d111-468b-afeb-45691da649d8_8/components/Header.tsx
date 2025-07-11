'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600" style={{ fontFamily: 'var(--font-pacifico)' }}>
            CalorieTracker
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
              Dashboard
            </Link>
            <Link href="/food-log" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
              Food Log
            </Link>
            <Link href="/meal-plan" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
              Meal Plan
            </Link>
            <Link href="/goals" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
              Goals
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Dashboard
              </Link>
              <Link href="/food-log" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Food Log
              </Link>
              <Link href="/meal-plan" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Meal Plan
              </Link>
              <Link href="/goals" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Goals
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}