import { useEffect, useRef, useState } from "react"
import { Room } from "./Room";
import useUser from "../contexts/UserContext";

const Lobby = () => {

    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraRdy, setCameraRdy] = useState(false);
    const { user } = useUser();
    const [joined, setJoined] = useState(false);
    const endCall = () => {
        setJoined(false);
    }
    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        // MediaStream
        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        setLocalAudioTrack(audioTrack);
        setlocalVideoTrack(videoTrack);
        if (!videoRef.current) {
            setCameraRdy(false);
            return;
        }
        setCameraRdy(true);
        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play();
        // MediaStream
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam()
        }
    }, [videoRef]);

    if (!joined) {

        return (
            <div style={{ display: 'flex', gap: "20px", alignItems: "center", justifyContent: "center", flexDirection: "column", minHeight: "100vh" }}>
                <video style={{ backgroundColor: "grey", borderRadius: "10px", aspectRatio: "16/9" }} autoPlay width={500} height="auto" ref={videoRef}></video>
                {cameraRdy ? <p style={{ color: "green" }}>Ready to Join</p> : <p style={{ color: "red" }}>Camera not ready</p>}
                <button className="primaryBtn" onClick={() => {
                    setJoined(true);
                }}>Connect</button>
            </div>
        )
    }

    return <Room endCall={endCall} name={user.name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}

export default Lobby