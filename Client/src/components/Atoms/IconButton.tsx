import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip";import { Button } from "../ui/button";

const IconButton = ({ onClick, icon, label, color, className }: { onClick: () => void, icon: string, label: string, color: string, className?: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClick}
          className={`h-8 w-8 p-0 hover:bg-transparent ${color} ${className}`}
        >
          <span className="text-lg">{icon}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

export default IconButton;