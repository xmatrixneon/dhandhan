"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

const INDIAN_NAMES = [
  "Priya", "Rahul", "Ananya", "Arjun", "Kavya", "Aarav", "Diya", "Vihaan",
  "Ishita", "Kabir", "Sanya", "Advik", "Myra", "Aryan", "Riya", "Vivaan",
  "Anika", "Atharv", "Sara", "Ayaan", "Meera", "Krishna", "Zara", "Ishaan",
  "Pari", "Arnav", "Kiara", "Reyansh", "Ananya", "Shaurya", "Aditi", "Aarav",
  "Sneha", "Rohit", "Neha", "Karan", "Pooja", "Amit", "Shreya", "Vikram",
  "Rani", "Dev", "Kiran", "Raj", "Lakshmi", "Gaurav", "Suman", "Manish",
  "Geeta", "Suresh", "Rekha", "Mahesh", "Savita", "Rakesh", "Babita", "Dinesh",
  "Sunita", "Mukesh", "Anita", "Ramesh", "Kavita", "Sanjay", "Vimla", "Vinod",
  "Shashi", "Prakash", "Sarla", "Kewal", "Kamlesh", "Bhawana", "Harish", "Chandra"
];

const PRIZE_AMOUNTS = [500, 1000, 2000, 3000, 4000, 5000];

interface Winner {
  name: string;
  amount: number;
  id: number;
}

export function WinnerTicker() {
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate initial winner
    generateWinner();

    // Change winner every 3-5 seconds
    const interval = setInterval(() => {
      generateWinner();
    }, Math.random() * 2000 + 3000); // Random between 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  const generateWinner = () => {
    // Fade out
    setIsVisible(false);

    // Generate new winner after fade out
    setTimeout(() => {
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomAmount = PRIZE_AMOUNTS[Math.floor(Math.random() * PRIZE_AMOUNTS.length)];
      const newWinner: Winner = {
        name: randomName,
        amount: randomAmount,
        id: Date.now()
      };

      setCurrentWinner(newWinner);

      // Fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 300);
  };

  if (!currentWinner) return null;

  return (
    <div
      className={`bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        animation: "pulse-glow 2s ease-in-out infinite"
      }}
    >
      <Trophy className="h-4 w-4 text-yellow-800 flex-shrink-0" />
      <span className="text-sm font-bold text-yellow-900 whitespace-nowrap">
        {currentWinner.name} just won ₹{currentWinner.amount}! 🎉
      </span>
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
