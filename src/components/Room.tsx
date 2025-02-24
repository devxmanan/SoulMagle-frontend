import { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
// import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import useUser from "../contexts/UserContext";

const URL = import.meta.env.VITE_SERVER_URL;

export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack,
    endCall
}: {
    name: string,
    localAudioTrack: MediaStreamTrack | null,
    localVideoTrack: MediaStreamTrack | null,
    endCall: () => void,
}) => {
    // const [searchParams, setSearchParams] = useSearchParams();
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState<null | Socket>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const { user } = useUser();
    const remoteVideoRef = useRef<any>();
    const localVideoRef = useRef<any>();

    const handleEndCall = () => {
        endCall();
        sendingPc?.close();
        receivingPc?.close();
        setSendingPc(null);
        setReceivingPc(null);
        setLobby(true);
        socket?.disconnect();
    }
    //to fix errors
    if (socket || sendingPc || receivingPc || remoteVideoTrack || remoteAudioTrack || remoteMediaStream) { }
    
    useEffect(() => {
        const socket = io(URL, { query: { userId: user._id } });
        socket.on('send-offer', async ({ roomId }) => {
            console.log("sending offer");
            setLobby(false);
            const pc = new RTCPeerConnection();
            setSendingPc(pc);
            if (localVideoTrack) {
                console.error("added tack");
                console.log(localVideoTrack)
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                console.error("added tack");
                console.log(localAudioTrack)
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = async (e) => {
                console.log("receiving ice candidate locally");
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "sender",
                        roomId
                    })
                }
            }

            pc.onnegotiationneeded = async () => {
                console.log("on negotiation neeeded, sending offer");
                const sdp = await pc.createOffer();
                //@ts-ignore
                pc.setLocalDescription(sdp)
                socket.emit("offer", {
                    sdp,
                    roomId
                })
            }
        });

        socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
            console.log("received offer");
            setLobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription(remoteSdp)
            const sdp = await pc.createAnswer();
            //@ts-ignore
            pc.setLocalDescription(sdp)
            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }

            setRemoteMediaStream(stream);
            // trickle ice 
            setReceivingPc(pc);
            //@ts-ignore
            window.pcr = pc;

            pc.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return;
                }
                console.log("omn ice candidate on receiving seide");
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomId
                    })
                }
            }

            socket.emit("answer", {
                roomId,
                sdp: sdp
            });
            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track
                const track2 = pc.getTransceivers()[1].receiver.track
                console.log(track1);
                if (track1.kind === "video") {
                    setRemoteAudioTrack(track2)
                    setRemoteVideoTrack(track1)
                } else {
                    setRemoteAudioTrack(track1)
                    setRemoteVideoTrack(track2)
                }
                remoteVideoRef.current.srcObject.addTrack(track1)
                remoteVideoRef.current.srcObject.addTrack(track2)
                remoteVideoRef.current.play();
            }, 5000)
        });

        socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
            if (roomId) { }
            setLobby(false);
            setSendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp)
                return pc;
            });
            console.log("loop closed");
        })


        socket.on("lobby", () => {
            setLobby(true);
        })

        socket.on("add-ice-candidate", ({ candidate, type }) => {
            console.log("add ice candidate from remote");
            console.log({ candidate, type })
            if (type == "sender") {
                setReceivingPc(pc => {
                    if (!pc) {
                        console.error("receicng pc nout found")
                    } else {
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingPc(pc => {
                    if (!pc) {
                        console.error("sending pc nout found")
                    } else {
                        // console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        })

        setSocket(socket)
    }, [name])

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef])

    return <div className="room">
        <div className="userRandom" >
            {lobby ? "Waiting to connect you to someone" : "connected successfully"}
            <video className="videos_after_connection" autoPlay width={400} height={"auto"} ref={remoteVideoRef} />
            <button style={{ height: "50px", width: "50px", borderRadius: "40px", border: "none", fontSize: "30px", backgroundColor: "grey", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px", cursor: "pointer" }}><FaArrowRight /></button>
        </div>
        <div className="userMe" >
            Hi {name}
            <video className="videos_after_connection" autoPlay width={400} height={"auto"} ref={localVideoRef} />
            <button onClick={handleEndCall} style={{ height: "50px", width: "50px", borderRadius: "40px", border: "none", fontSize: "30px", backgroundColor: "#e8433e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px", cursor: "pointer" }}><MdCallEnd /></button>
        </div>

    </div>
}

