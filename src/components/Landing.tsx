import { useEffect, useRef, useState } from "react"
// import { Link } from "react-router-dom";
import { Room } from "./Room";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Landing = () => {


    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            if (user) {
                setUser(user);
            } else {
                navigate("/login", { replace: true })
            }
        });

        return () => unsubscribe();
    }, []);
    console.log(user);


    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraRdy, setCameraRdy] = useState(false);

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

        return <div style={{ display: 'flex', gap: "20px", alignItems: "center", justifyContent: "center", flexDirection: "column", minHeight: "100vh" }}>
            <video style={{ backgroundColor: "grey", borderRadius: "10px", aspectRatio: "16/9" }} autoPlay width={500} height="auto" ref={videoRef}></video>
            {cameraRdy ? <p style={{ color: "green" }}>Ready to Join</p> : <p style={{ color: "red" }}>Camera not ready</p>}
            <button className="primaryBtn" onClick={() => {
                setJoined(true);
            }}>Connect</button>
        </div>
    }

    return <Room endCall={endCall} name={"Manan"} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}