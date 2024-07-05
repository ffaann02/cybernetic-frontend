// import React, { useEffect, useRef } from 'react';

// type WebSocketComponentProps = {
//   userId: string;
// };

// const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ userId }) => {
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // Initialize WebSocket connection
//     socketRef.current = new WebSocket(`http://localhost:3000/websocket/join-room/${userId}`);

//     // Set up event listeners
//     socketRef.current.onopen = (event) => {
//       console.log('Connected to WebSocket server.');
//     };

//     socketRef.current.onmessage = (event) => {
//       console.log('Received message:', event.data);
//     };

//     socketRef.current.onclose = (event) => {
//       console.log('Disconnected from WebSocket server.');
//     };

//     socketRef.current.onerror = (event) => {
//       console.error('WebSocket error:', event);
//     };

//     // Clean up WebSocket connection when component unmounts
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, [userId]);


//   return <div>WebSocket Component</div>;
// };

// export default WebSocketComponent;