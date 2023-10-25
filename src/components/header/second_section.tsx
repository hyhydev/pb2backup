import { Bell, LogIn, Plus, Search } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useUIStore } from "~/stores/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function HeaderSecondSection() {
  const { data: session, status: sessionStatus } = useSession();
  const { fullWidthSearch, showFullWidthSearch } = useUIStore();

  return (
    <div
      className={`mr-2 flex-shrink-0 items-center md:gap-2 ${
        fullWidthSearch ? "hidden" : "flex"
      }`}
    >
      <Button
        onClick={() => showFullWidthSearch()}
        size="icon"
        variant="ghost"
        className="md:hidden"
      >
        <Search />
      </Button>
      <Button size="icon" variant="ghost">
        <Plus />
      </Button>
      <Button size="icon" variant="ghost">
        <Bell />
      </Button>
      {sessionStatus === "loading" ? (
        <div>Loading...</div>
      ) : session ? (
        <Button size="icon" variant="link" onClick={() => void signOut()}>
          <Avatar>
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </Button>
      ) : (
        <Button size="icon" variant="link" onClick={() => void signIn()}>
          <LogIn />
        </Button>
      )}
    </div>
  );
}
