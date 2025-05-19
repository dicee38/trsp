# client/udp_client.py

import socket
import threading
import time
import json
import random

SERVER_IP = "127.0.0.1"
SERVER_PORT = 9999

username = input("Введите имя для аватара: ")
local_position = {"x": 0, "y": 0}

def send_position(sock):
    while True:
        local_position["x"] += random.randint(-1, 1)
        local_position["y"] += random.randint(-1, 1)

        data = json.dumps({"user": username, "pos": local_position})
        sock.sendto(data.encode(), (SERVER_IP, SERVER_PORT))
        time.sleep(0.1)

def receive_positions(sock):
    while True:
        try:
            data, _ = sock.recvfrom(1024)
            payload = json.loads(data.decode())
            print(f"[Аватар] {payload['user']} => {payload['pos']}")
        except:
            pass

def start_udp_client():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    threading.Thread(target=send_position, args=(sock,), daemon=True).start()
    receive_positions(sock)

if __name__ == "__main__":
    start_udp_client()
