from socketio import Server, WSGIApp
from flask import Flask
import json
from uuid import uuid4 as UUID

sio = Server(cors_allowed_origins='*')
app = Flask(__name__)
app.config['SECRET_KEY'] = 'some-super-secret-key'
app.wsgi_app = WSGIApp(sio, app.wsgi_app)

__ChatRooms__ = [
	{"name": "Chat Room 1", "id": str(UUID())},
	{"name": "Chat Room 2", "id": str(UUID())},
	{"name": "Chat Room 3", "id": str(UUID())},
	{"name": "Chat Room 4", "id": str(UUID())},
	{"name": "Chat Room 5", "id": str(UUID())},
	{"name": "Chat Room 6", "id": str(UUID())},
	{"name": "Chat Room 7", "id": str(UUID())},
]

@sio.event
def connect(sid, env):
	print('connected:', sid)
	print('environment:', env)
	sio.emit('room_list', __ChatRooms__, to=sid)

@sio.event
def disconnect(sid):
	print('disconnected:', sid)

@sio.event
def enter_room(sid, room):
	print('entering room:', sid, room)
	sio.enter_room(sid, room)

@sio.event
def leave_room(sid, room):
	print('leaving room:', sid, room)
	sio.leave_room(sid, room)

@sio.event
def send_message(sid, data):
	print('message sent:', sid, data)
	sio.emit("recv_message", data['message'], room=data['room'])

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=1005, debug=True, threaded=True)
