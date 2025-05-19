# server/tcp_server.py

import socket
import threading

HOST = '0.0.0.0'
PORT = 5555

sessions = {}  # session_id -> [player1_conn, player2_conn]
lock = threading.Lock()


def handle_client(conn, addr):
    print(f"[TCP] Connection from {addr}")
    session_id = conn.recv(1024).decode()
    print(f"[TCP] Player wants to join session {session_id}")

    with lock:
        if session_id not in sessions:
            sessions[session_id] = [conn]
            conn.send("Waiting for second player...\n".encode())
        else:
            sessions[session_id].append(conn)
            player1, player2 = sessions[session_id]
            player1.send("Second player connected. Game starts now.\n".encode())
            player2.send("Connected to game. Game starts now.\n".encode())
            threading.Thread(target=relay_moves, args=(player1, player2), daemon=True).start()
            threading.Thread(target=relay_moves, args=(player2, player1), daemon=True).start()


def relay_moves(sender, receiver):
    while True:
        try:
            move = sender.recv(1024)
            if not move:
                break
            receiver.send(move)
        except:
            break


def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"[TCP] Server listening on {HOST}:{PORT}")

        while True:
            conn, addr = s.accept()
            threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()


if __name__ == "__main__":
    start_server()
