# client/tcp_client.py

import socket
import threading

def receive_moves(sock):
    while True:
        try:
            data = sock.recv(1024)
            if data:
                print(f"\nХод соперника: {data.decode()}")
            else:
                break
        except:
            break

def start_client(server_ip, server_port, session_id):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((server_ip, server_port))
    sock.send(session_id.encode())

    threading.Thread(target=receive_moves, args=(sock,), daemon=True).start()

    while True:
        move = input("Ваш ход (например, e2e4): ")
        if move.lower() in ['exit', 'quit']:
            break
        sock.send(move.encode())

    sock.close()

if __name__ == "__main__":
    ip = input("Введите IP сервера: ")
    port = int(input("Введите порт сервера: "))
    session = input("Введите session_id: ")
    start_client(ip, port, session)
