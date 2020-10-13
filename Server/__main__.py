import logging
from uuid import uuid4 as UUID

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room


logger = logging.getLogger(__name__)

app = Flask('Macros')
sio = SocketIO(app, cors_allowed_origins='*')

__ChatRooms__ = [
	{'name': 'Savedbygrace251', 'id':str(UUID())}
]

__RoomState__ = {}

@sio.on('connect')
def connect():
	sid = request.sid
	print('connected:', sid)
	emit('room_list', __ChatRooms__, to=sid)
	emit('get_id', sid, to=sid)

@sio.on('disconnect')
def disconnect():
	sid = request.sid
	print('disconnected:', sid)
	leave_room()

@sio.on('enter_room')
def enter_room(room):
	print('connected to room:', sid, room['id'])
	__RoomState__[sid] = room['id']
	join_room(room['id'])

@sio.on('leave_room')
def leave_room():
	sid = request.sid
	try:
		roomId = __RoomState__[sid]
		print('left room:', sid, roomId)
		leave_room()
		__RoomState__[sid] = ''
	except KeyError:
		pass

@sio.on('get_rooms')
def get_rooms(data):
	sid = request.sid
	logger.debug('data sent:', {'data': data, "sid": sid})
	emit('room_list', __ChatRooms__, to=sid)

@sio.on('send_message')
def send_message(data):
	sid = request.sid
	logger.debug('message sent:', {'message': data['message'], "sid": sid})
	print('message sent:', {'message': data['message'], "sid": sid})
	print('data:', data)
	print('rooms:', __RoomState__)
	emit("recv_message", {'message': data['message'], "sid": sid}, room=data['room']['id'])

@sio.on('add_room')
def add_room(data):
	logger.debug('adding chatroom: ' + data['name'])
	__ChatRooms__.append({'name': data['name'], 'id': str(UUID())})
	emit('room_list', __ChatRooms__, broadcast=True)

if __name__ == "__main__":
	sio.run(app, host="0.0.0.0", port=5001, debug=True)
	sio.stop()
