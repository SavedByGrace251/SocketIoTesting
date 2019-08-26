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

__RoomState__ = {}

@sio.event
def connect(sid, env):
	sio.emit('room_list', __ChatRooms__, to=sid)

@sio.event
def disconnect(sid):
	print('disconnected:', sid)
	leave_room(sid)

@sio.event
def enter_room(sid, room):
	print('###########################\nentering room:', sid, room['id'])
	__RoomState__[sid] = room['id']
	sio.enter_room(sid, room['id'])

@sio.event
def leave_room(sid):
	roomId = __RoomState__[sid]
	print('###########################\nleaving room:', sid, roomId)
	sio.leave_room(sid, roomId)
	__RoomState__[sid] = ''

@sio.event
def send_message(sid, data):
	print('message sent:', sid, data)
	sio.emit("recv_message", {'message': data['message'], sid: sid}, room=data['room']['id'])

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=1005, debug=True, threaded=True)
