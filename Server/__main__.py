import json
import logging
import sys
from uuid import uuid4 as UUID

from flask import Flask
from socketio import Server, WSGIApp

logger = logging.getLogger(__name__)

sio = Server(cors_allowed_origins='*')
app = Flask(__name__)
app.config['SECRET_KEY'] = 'some-super-secret-key'
app.wsgi_app = WSGIApp(sio, app.wsgi_app)

__ChatRooms__ = [
	{'name': 'Savedbygrace251', 'id':str(UUID())}
]

__RoomState__ = {}

@sio.event
def connect(sid, env):
	print('disconnected:', sid)
	sio.emit('room_list', __ChatRooms__, to=sid)
	sio.emit('get_id', sid, to=sid)

@sio.event
def disconnect(sid):
	print('disconnected:', sid)
	leave_room(sid)

@sio.event
def enter_room(sid, room):
	print('connected to room:', sid, room['id'])
	__RoomState__[sid] = room['id']
	sio.enter_room(sid, room['id'])

@sio.event
def leave_room(sid):
	try:
		roomId = __RoomState__[sid]
		print('left room:', sid, roomId)
		sio.leave_room(sid, roomId)
		__RoomState__[sid] = ''
	except KeyError:
		pass

@sio.event
def send_message(sid, data):
	logger.debug('message sent:', {'message': data['message'], "sid": sid})
	print('message sent:', {'message': data['message'], "sid": sid})
	print('data:', data)
	print('rooms:', __RoomState__)
	sio.emit("recv_message", {'message': data['message'], "sid": sid}, room=data['room']['id'])

@sio.event
def add_room(sid, data):
	logger.debug('adding chatroom: ' + data['name'])
	__ChatRooms__.append({'name': data['name'], 'id': str(UUID())})
	sio.emit('room_list', __ChatRooms__, broadcast=True)

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5001, debug=True, threaded=True)
