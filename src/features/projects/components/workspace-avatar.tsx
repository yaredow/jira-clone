import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ProjectAvatarProps = {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
};

export default function ProjectAvatar({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) {
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt="name" className="object-cover" fill />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
          fallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
