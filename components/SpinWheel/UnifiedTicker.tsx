"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, CheckCircle2 } from "lucide-react";

const NAMES = [
  "Priya","Rahul","Ananya","Arjun","Kavya","Aarav","Diya","Vihaan",
  "Ishita","Kabir","Sanya","Myra","Aryan","Riya","Vivaan","Sara","Ayaan",
  "Meera","Krishna","Zara","Ishaan","Pari","Arnav","Reyansh","Shaurya",
  "Sneha","Rohit","Neha","Karan","Pooja","Amit","Shreya","Vikram","Rani",
  "Dev","Kiran","Raj","Lakshmi","Gaurav","Suman","Rakesh","Dinesh","Suresh",
  "Rekha","Mahesh","Savita","Mukesh","Anita","Ramesh","Kavita","Sanjay",
];

const WIN_AMOUNTS      = [500, 1000, 2000, 3000, 4000, 5000];
const WITHDRAW_AMOUNTS = [100, 500, 1000, 1500, 2000, 2500, 3000, 5000];

type Kind = "win" | "withdraw";
interface Activity { kind: Kind; name: string; amount: number; key: number }

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeActivity(): Activity {
  const kind: Kind = Math.random() > 0.4 ? "win" : "withdraw";
  return {
    kind,
    name:   rand(NAMES),
    amount: rand(kind === "win" ? WIN_AMOUNTS : WITHDRAW_AMOUNTS),
    key:    Date.now() + Math.random(),
  };
}

export function UnifiedTicker() {
  const [current,  setCurrent]  = useState<Activity>(makeActivity);
  const [visible,  setVisible]  = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setCurrent(makeActivity());
        setVisible(true);
        timerRef.current = setTimeout(cycle, 2800 + Math.random() * 1200);
      }, 300);
    };
    timerRef.current = setTimeout(cycle, 2800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isWin = current.kind === "win";

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {isWin ? (
        <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      )}
      <p className="text-xs font-semibold whitespace-nowrap"
        style={{ color: isWin ? "#facc15" : "#34d399" }}>
        {current.name}{" "}
        {isWin ? `won ₹${current.amount} 🎉` : `withdrew ₹${current.amount} ✓`}
      </p>
    </div>
  );
}