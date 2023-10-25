/* eslint-disable @next/next/no-img-element */
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { formatTimeAgo } from "~/utils/formatTimeAgo";

const playWithUserAndBookmarks = Prisma.validator<Prisma.PlayDefaultArgs>()({
  include: {
    user: { select: { id: true, name: true, image: true } },
    bookmarks: true,
  },
});

type PlayGridItemProps = Prisma.PlayGetPayload<typeof playWithUserAndBookmarks>;

const VIEW_FORMATTER = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function PlayGridItem({
  id,
  name,
  user,
  bookmarks,
  createdAt,
  thumbnailUrl,
  videoUrl,
  character,
  type,
}: PlayGridItemProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current == null) return;

    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a href={`/play/${id}`} className="relative aspect-video">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Play Thumbnail"
            className={`block h-full w-full rounded-xl object-cover transition-[border-radius] duration-200`}
          />
        )}
        {/* <div className="bg-secondary-dark absolute bottom-1 right-1 rounded px-0.5 text-sm text-secondary">
          {formatDuration(378)}
        </div> */}
        <video
          className={`absolute inset-0 block h-full rounded-xl object-cover transition-opacity duration-200 ${
            isVideoPlaying || !thumbnailUrl
              ? "opacity-100 delay-200"
              : "opacity-0"
          }`}
          ref={videoRef}
          muted
          playsInline
          src={videoUrl}
        />
      </a>
      <div className="flex gap-2">
        <a href={`/@${user.id}`} className="flex flex-shrink-0 items-center">
          <img
            className="h-12 w-12 rounded-full"
            src={user.image ?? ""}
            alt="User Profile Picture"
          />
        </a>
        <div className="flex flex-col">
          <a href={`/watch?v=${id}`} className="font-bold">
            {name}
          </a>
          <a href={`/@${user.id}`} className="text-sm">
            {character} • {type}
          </a>
          <a href={`/@${user.id}`} className="text-sm">
            {VIEW_FORMATTER.format(bookmarks.length)} Likes •{" "}
            {formatTimeAgo(createdAt)}
          </a>
        </div>
      </div>
    </div>
  );
}
