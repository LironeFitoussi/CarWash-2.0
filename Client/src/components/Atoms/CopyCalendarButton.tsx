import { toast } from "sonner";
import { Button } from "../ui/button";
import { eventsApi } from "@/api/events";

export default function CopyCalendarButton() {
    const copyICalendarUrl = () => {
        const url = eventsApi.getICalendarUrl();
        navigator.clipboard.writeText(url);
        toast.success("Calendar URL copied to clipboard");
      };
      
    return (
        <div className="flex justify-between items-center mb-4">
        <Button onClick={copyICalendarUrl}>Copy iCalendar URL</Button>
      </div>
    );
}
