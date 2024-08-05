import { memo } from "react";

const Room = memo(({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
});

export default Room;
