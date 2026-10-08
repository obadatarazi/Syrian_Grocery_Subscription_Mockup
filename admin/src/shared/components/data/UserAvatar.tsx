import { cn } from "@/shared/design-system/components/ui/utils";

const avatarColors = [
  "bg-teal-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-pink-500",
] as const;

type UserAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-sm",
} as const;

export function UserAvatar({ name, size = "sm", className }: UserAvatarProps) {
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div
      className={cn(
        "flex flex-none select-none items-center justify-center rounded-full font-black text-white",
        sizeClasses[size],
        color,
        className,
      )}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}
