# server/udp_server.py

import socket
import threading
import json

HOST = '0.0.0.0'
PORT = 9999

clients = set()
lock = threading.Lock()

def handle_packet(data, addr, sock):
    with lock:
        clients.add(addr)

    for client in clients:
        if client != addr:
            try:
                sock.sendto(data, client)
            except:
                pass  # сокет клиента может быть недоступен

def start_udp_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((HOST, PORT))
    print(f"[UDP] Сервер слушает на {HOST}:{PORT}")

    while True:
        data, addr = sock.recvfrom(1024)
        threading.Thread(target=handle_packet, args=(data, addr, sock), daemon=True).start()

if __name__ == "__main__":
    start_udp_server()
