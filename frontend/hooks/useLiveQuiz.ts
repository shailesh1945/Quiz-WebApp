import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function connectLive(
  eventId:number,
  handlers:{
    onBoard?:(rows:any)=>void;
    onTimer?:(data:any)=>void;
    onStatus?:(status:string)=>void;
  }
){

  const socket = new SockJS(
    "http://localhost:8080/ws"
  );

  const client = new Client({
    webSocketFactory:()=>socket,

    onConnect:()=>{

      client.subscribe(
        `/topic/leaderboard/${eventId}`,
        (msg)=>{
          handlers.onBoard?.(
            JSON.parse(msg.body)
          );
        }
      );

      client.subscribe(
        `/topic/timer/${eventId}`,
        (msg)=>{
          handlers.onTimer?.(
            JSON.parse(msg.body)
          );
        }
      );

      client.subscribe(
        `/topic/status/${eventId}`,
        (msg)=>{
          handlers.onStatus?.(
            msg.body
          );
        }
      );
    }
  });

  client.activate();

  return ()=>client.deactivate();
}