import Image from "next/image";
import { User } from "lucide-react";

interface CastMember {
  id: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
  characterName: string | null;
}

interface CastListProps {
  castMembers: CastMember[];
}

export function CastList({ castMembers }: CastListProps) {
  if (castMembers.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="cast-heading">
      <div className="mb-5 flex items-end gap-3">
        <h2 id="cast-heading" className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl">
          Cast & Crew
        </h2>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {castMembers.map((member) => (
          <div
            key={member.id}
            className="group flex flex-shrink-0 w-28 flex-col items-center text-center"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-800/50 ring-1 ring-zinc-700/50 transition-all duration-300 group-hover:ring-amber/30">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-8 w-8 text-zinc-600" />
                </div>
              )}
            </div>
            <p className="mt-2.5 text-sm font-medium text-zinc-200">{member.name}</p>
            {member.characterName && (
              <p className="text-xs text-zinc-500">{member.characterName}</p>
            )}
            {member.role && member.role !== "Actor" && (
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-600">{member.role}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
