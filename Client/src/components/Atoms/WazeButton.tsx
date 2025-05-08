import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface WazeButtonProps {
  address: string;
}

export const WazeButton: React.FC<WazeButtonProps> = ({ address }) => {
  if (!address) return null;
  const encoded = encodeURIComponent(address);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={() => {
              window.open(
                `https://waze.com/ul?q=${encoded}&navigate=yes`,
                "_blank"
              );
            }}
          >
            <img
              className="w-5 h-5 object-contain rounded cursor-pointer"
              src="/images/waze.png"
              alt="Open in Waze"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open in Waze</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 