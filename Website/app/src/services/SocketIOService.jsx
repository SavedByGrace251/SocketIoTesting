import React, { useState, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import io from "socket.io-client";
import { SocketEvent } from "../constants";

export const SocketIO = React.createContext();
export const useSocketIO = () => useContext(SocketIO);
export const SocketIOProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [socket, setSocket] = useState(undefined);
  const [connected, setConnected] = useState(false);

  const handleNoConnection = () => {
    setConnected(false);
    enqueueSnackbar("No connection!", {
      key: "SocketIO_Disconnected",
      preventDuplicate: true,
      variant: "error",
      persist: true,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };
  const handleConnection = () => {
    setConnected(true);
    closeSnackbar("SocketIO_Disconnected");
  };
  const toastMessage = (data) => {
    console.log('Message received:', data);
    enqueueSnackbar(data.message, { 
      variant: data.type ? data.type : "default",
      autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 1500,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  }

  useEffect(() => {
    var client = io.connect(`http://${window.location.hostname}:5001`);
    setSocket(client)
    client.on(SocketEvent.connect, handleConnection);
    client.on(SocketEvent.disconnect, handleNoConnection);
    client.on(SocketEvent.connect_error, handleNoConnection);
    client.on(SocketEvent.message, toastMessage);
  }, []);

  return (
    <SocketIO.Provider
      value={
        {
          socket,
          connected
        }
      }
    >
      {children}
    </SocketIO.Provider>
  );
}
