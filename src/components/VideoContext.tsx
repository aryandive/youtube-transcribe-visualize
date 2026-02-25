import { VideoDetails } from "@/lib/api";
import { Eye, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoContextProps {
  video: VideoDetails;
}

const VideoContext = ({ video }: VideoContextProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h2 className="font-semibold text-sm leading-snug line-clamp-2">{video.title}</h2>
        <p className="text-xs text-muted-foreground font-medium">{video.channel}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{video.views}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{video.duration}</span>
          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{video.publishedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoContext;
