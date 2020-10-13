import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  Divider,
  Button,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Send } from "@material-ui/icons";
import { socketConnect } from "socket.io-react";
import { withSnackbar } from "notistack";
import ChatMessage from "./ChatMessage";
import { SocketEvent } from "../../constants";
import { useSocketIO } from "../../services";
import { toastMessage } from "../../functions/toaster";

const styles = {
  buttonText: {
    paddingRight: 4,
  },
  card: {
    padding: 8,
    flex: 80,
    height: "100%",
  },
  view: {
    padding: 16,
  },
  title: {
    fontSize: 20,
  },
  messages: {
    marginTop: 8,
    marginBottom: 8,
    flexWrap: "nowrap",
    overflow: "auto",
  },
  message: {
    paddingRight: 16,
  },
  messageField: {
    marginTop: 8,
  },
  myMessage: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  chatMessage: {
    fontSize: 14,
    margin: 4,
    padding: 4,
    paddingRight: 8,
    paddingLeft: 8,
    maxWidth: "60%",
  },
  chatUser: {
    borderRadius: "50%",
    margin: 4,
    padding: 4,
    paddingRight: 8,
    paddingLeft: 8,
  },
  flex: {
    flex: 1,
  },
};

const ChatMessageForm = withStyles(styles, { name: "ChatMessageForm" })(
  socketConnect(({ classes, socket, room }) => {
    const [message, setMessage] = useState("");

    const keyPressed = (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    };

    const sendMessage = () => {
      if (message != "") {
        socket.emit(SEND_MESSAGE, { message: message, room: room });
        setMessage("");
      }
    };

    const updateMessage = (event) => {
      setMessage(event.target.value);
    };

    return (
      <Grid
        container
        direction='row'
        justify='center'
        className={classes.messageField}
      >
        <TextField
          autoFocus
          placeholder='Message'
          className={[classes.flex, classes.message].join(" ")}
          onKeyPress={keyPressed}
          onChange={updateMessage}
          value={message}
        />
        <Button variant='contained' color='primary' onClick={sendMessage}>
          <Grid
            container
            direction='row'
            justify='space-between'
            alignItems='center'
          >
            <span className={classes.buttonText}>Send</span>
            <Send />
          </Grid>
        </Button>
      </Grid>
    );
  })
);

const ChatViewMessageList = withStyles(styles, { name: "ChatViewMessageList" })(
  ({ classes, messages, setMessageEnd, userSid }) => {
    return (
      <Grid
        container
        direction='column'
        className={[classes.flex, classes.messages].join(" ")}
      >
        {messages.map((message, idx) => (
          <ChatMessage key={idx} userSid={userSid} message={message} />
        ))}
        <div ref={setMessageEnd}></div>
      </Grid>
    );
  }
);

const ChatViewTitle = withStyles(styles, { name: "ChatViewTitle" })(
  ({ classes, title }) => {
    return (
      <Typography className={classes.title} gutterBottom>
        {title}
      </Typography>
    );
  }
);

const ChatView = (props) => {
  const { socket, connected } = useSocketIO();

  const [chatRooms, setChatRooms] = useState({});
  const [sid, setSid] = useState("");
  const [messageEndRef, setMessageEndRef] = useState(undefined);

  useEffect(() => {
    if (connected) {
      socket.on(SocketEvent.getId, (payload) => {
        setSid(payload);
      });
      socket.on(SocketEvent.recvMessage, (payload) => {
        toastMessage(props.enqueueSnackbar, payload.message);
        var obj = {};
        var roomMessages = [];
        if (state[props.chat.id]) {
          roomMessages = state[props.chat.id];
        }
        obj[props.chat.id] = [...roomMessages, payload];
        setChatRooms(obj);
        scrollToBottom();
      });
    }
  }, [connected, socket]);

  const scrollToBottom = () => {
    messageEndRef.scrollIntoView({ behavior: "smooth" });
  };

  const classes = props.classes;
  const chatSelected = props.chat !== undefined;
  var messages = [];
  if (chatSelected) {
    if (chatRooms[props.chat.id]) {
      messages = chatRooms[props.chat.id];
    }
  }
  return (
    <Grid item className={classes.card}>
      <Card style={{ height: "100%" }}>
        {chatSelected ? (
          <Grid
            style={{ padding: 16, height: "100%" }}
            container
            direction='column'
          >
            <ChatViewTitle title={props.chat.name} />
            <Divider />
            <ChatViewMessageList
              messages={messages}
              setMessageEnd={setMessageEndRef}
              userSid={sid}
            />
            <Divider />
            <ChatMessageForm room={props.chat} />
          </Grid>
        ) : (
          <Grid
            container
            justify='center'
            alignItems='center'
            style={{ height: "100%" }}
          >
            <Grid item>
              <Typography variant='h4'>No chat room selected.</Typography>
            </Grid>
          </Grid>
        )}
      </Card>
    </Grid>
  );
};

export default withStyles(styles, { name: "ChatView" })(
  withSnackbar(socketConnect(ChatView))
);
