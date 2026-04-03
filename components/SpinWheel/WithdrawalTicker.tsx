"use client";

import { useState, useEffect } from "react";
import { IndianRupee, CheckCircle2 } from "lucide-react";

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

const WITHDRAWAL_AMOUNTS = [100, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];

interface Withdrawal {
  name: string;
  amount: number;
  id: number;
}

export function WithdrawalTicker() {
  const [currentWithdrawal, setCurrentWithdrawal] = useState<Withdrawal | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate initial withdrawal
    generateWithdrawal();

    // Change withdrawal every 4-6 seconds (slightly different from winner ticker)
    const interval = setInterval(() => {
      generateWithdrawal();
    }, Math.random() * 2000 + 4000); // Random between 4-6 seconds

    return () => clearInterval(interval);
  }, []);

  const generateWithdrawal = () => {
    // Fade out
    setIsVisible(false);

    // Generate new withdrawal after fade out
    setTimeout(() => {
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomAmount = WITHDRAWAL_AMOUNTS[Math.floor(Math.random() * WITHDRAWAL_AMOUNTS.length)];
      const newWithdrawal: Withdrawal = {
        name: randomName,
        amount: randomAmount,
        id: Date.now()
      };

      setCurrentWithdrawal(newWithdrawal);

      // Fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 300);
  };

  if (!currentWithdrawal) return null;

  return (
    <div
      className={`bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        animation: "pulse-glow-green 2s ease-in-out infinite"
      }}
    >
      <CheckCircle2 className="h-4 w-4 text-green-800 flex-shrink-0" />
      <span className="text-sm font-bold text-green-900 whitespace-nowrap">
        {currentWithdrawal.name} withdrew ₹{currentWithdrawal.amount} ✓
      </span>
      <style jsx>{`
        @keyframes pulse-glow-green {
          0%, 100% {
            box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
