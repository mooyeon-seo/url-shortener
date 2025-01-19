import { Card } from "@/components/ui/card";
import {  } from "@/components/ui/chart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Click Statistics</h2>
              {/* Add LineChart component */}
            </div>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}