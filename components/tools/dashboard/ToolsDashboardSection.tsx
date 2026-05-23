"use client";

import Link from "next/link";
import { BookOpen, Zap, Brain, FileText, Activity } from "lucide-react";
import TeachPackDashboardSection from "@/components/tools/teachpack/TeachPackDashboardSection";
import type { Profile } from "@/types";

type ToolKey = "teachpack" | "lastminprep" | "mindmap" | "quiz" | "activity";

interface ToolConfig {
  key: ToolKey;
  icon: typeof BookOpen;
  name: string;
  desc: string;
  cardStyle: string;
  iconContainer: string;
  iconColor: string;
}

const tools: ToolConfig[] = [
  {
    key: "lastminprep",
    icon: Zap,
    name: "Last Min Preperation",
    desc: "Rapid revision card",
    cardStyle:
      "border-yellow-100 hover:border-yellow-200 hover:shadow-yellow-50",
    iconContainer: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    key: "mindmap",
    icon: Brain,
    name: "Mindmap Visual",
    desc: "Visual concept map",
    cardStyle:
      "border-purple-100 hover:border-purple-200 hover:shadow-purple-50",
    iconContainer: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    key: "quiz",
    icon: FileText,
    name: "Quiz/Test Creator",
    desc: "Test paper generator",
    cardStyle: "border-green-100 hover:border-green-200 hover:shadow-green-50",
    iconContainer: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    key: "activity",
    icon: Activity,
    name: "Classroom activities",
    desc: "Classroom activities",
    cardStyle:
      "border-orange-100 hover:border-orange-200 hover:shadow-orange-50",
    iconContainer: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

function ToolCard({ tool }: { tool: ToolConfig }) {
  const { icon: Icon, name, desc, cardStyle, iconContainer, iconColor } = tool;

  return (
    <Link
      href={`/app/${tool.key}/new`}
      className={`flex flex-col w-full text-left bg-white border-2 rounded-[24px] p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cardStyle}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${iconContainer}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-jakarta font-bold text-[#0F0F1A] text-[16px]">
            {name}
          </h3>
          {/* <p className="text-[#6B6B8A] text-[13px] leading-tight">{desc}</p> */}
        </div>
      </div>
    </Link>
  );
}

export default function ToolsDashboardSection({
  profile,
}: {
  profile: Profile;
}) {
  return (
    <section className="mb-2 w-full">
      <div className="flex flex-col gap-4 py-2">
        <div className="w-full lg:w-[80%] mx-auto pb-2">
          <TeachPackDashboardSection profile={profile} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.key} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
