import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type MemberAvatarProps = {
  name: string;
  className?: string;
  fallbackClassName?: string;
};

export default function MemberAvatar({
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-10 transition border border-neutral-300 rounded-full",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center",
          fallbackClassName,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
