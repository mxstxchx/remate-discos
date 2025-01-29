"use client";

import { LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/sessionStore";

export function NavBar() {
  const { alias } = useSessionStore();

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">
            Happy digging, <span className="text-primary">{alias}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {}}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* Later we'll add a badge for cart items */}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {}}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}