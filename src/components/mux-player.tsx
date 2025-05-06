import MuxPlayerInternal, { type MuxPlayerProps } from "@mux/mux-player-react";
import React from "react";

const MuxPlayer = (props: MuxPlayerProps) => {
    const [isHydrated, setIsHydrated] = React.useState(false);

    React.useEffect(() => {
        setIsHydrated(true);
    }, []);

    if(!isHydrated) {
        return <p>Video is rendering</p>
    }
  return (
    <MuxPlayerInternal {...props} />
  )
}

export default MuxPlayer