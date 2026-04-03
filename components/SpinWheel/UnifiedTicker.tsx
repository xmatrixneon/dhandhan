"use client";

import { useState, useEffect } from "react";
import { Trophy, IndianRupee, CheckCircle2 } from "lucide-react";

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

const WIN_AMOUNTS = [500, 1000, 2000, 3000, 4000, 5000];
const WITHDRAWAL_AMOUNTS = [100, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];

type ActivityType = "winner" | "withdrawal";

interface Activity {
  type: ActivityType;
  name: string;
  amount: number;
  id: number;
}

export function UnifiedTicker() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Generate initial activities
    const initialActivities: Activity[] = [];
    for (let i = 0; i < 5; i++) {
      initialActivities.push(generateActivity());
    }
    setActivities(initialActivities);

    // Add new activity and rotate every 2-3 seconds
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateActivity();
        const updated = [...prev, newActivity];
        if (updated.length > 5) {
          updated.shift(); // Keep only 5 activities
        }
        return updated;
      });
      setCurrentIndex((prev) => (prev + 1) % 5);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const generateActivity = (): Activity => {
    const isWinner = Math.random() > 0.4; // 60% winners, 40% withdrawals
    const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
    const amounts = isWinner ? WIN_AMOUNTS : WITHDRAWAL_AMOUNTS;
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

    return {
      type: isWinner ? "winner" : "withdrawal",
      name: randomName,
      amount: randomAmount,
      id: Date.now() + Math.random()
    };
  };

  const currentActivity = activities[currentIndex];

  if (!currentActivity) return null;

  const isWinner = currentActivity.type === "winner";

  return (
    <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3 border-2 border-purple-200">
      {isWinner ? (
        <>
          <Trophy className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-sm font-bold text-gray-900">
              {currentActivity.name} won ₹{currentActivity.amount}! 🎉
            </p>
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-sm font-bold text-gray-900">
              {currentActivity.name} withdrew ₹{currentActivity.amount} ✓
            </p>
          </div>
        </>
      )}
    </div>
  );
}
