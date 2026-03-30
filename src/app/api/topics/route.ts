import { NextResponse } from "next/server";

const TOPICS = [
  { slug: "regime", name: "Regime", icon: "🥗" },
  { slug: "alimentation", name: "Alimentation", icon: "🍎" },
  { slug: "sante", name: "Sante", icon: "💚" },
  { slug: "maison", name: "Maison", icon: "🏠" },
  { slug: "conso", name: "Consommation", icon: "🛒" },
];

export async function GET() {
  return NextResponse.json(TOPICS);
}
