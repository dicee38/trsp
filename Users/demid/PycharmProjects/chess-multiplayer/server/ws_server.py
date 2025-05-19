import asyncio
import websockets
import json
import random
import datetime

connected_clients = set()

EVENTS = [
    "Legendary artifact appeared: King's Blade!",
    "Chess rain! Turns accelerated.",
    "Golden Queen discovered at square c6.",
    "Energy regenerates twice as fast!"
]

# Рассылка сообщения всем клиентам
async def notify_clients(data: dict):
    message = json.dumps(data)  # сериализуем ОДИН РАЗ
    if not connected_clients:
        return

    to_remove = set()
    for client in connected_clients:
        try:
            await client.send(message)
        except Exception as e:
            print(f"[WS] ❌ Failed to send: {e}")
            to_remove.add(client)

    connected_clients.difference_update(to_remove)

# Генерация случайных событий дня
async def broadcast_daily_events():
    while True:
        await asyncio.sleep(random.randint(60, 300))
        event_text = random.choice(EVENTS)
        event = {
            "type": "event",
            "text": event_text,
            "timestamp": str(datetime.datetime.now())
        }
        print(f"[WS] 🎉 Daily Event: {event_text}")
        await notify_clients(event)

# Обработка одного клиента
async def handle_connection(websocket):
    print("[WS] ✅ Client connected.")
    connected_clients.add(websocket)
    print(f"[WS] 👥 Total clients: {len(connected_clients)}")

    try:
        async for raw_message in websocket:
            print(f"[WS] 📩 Received raw: {raw_message}")
            try:
                data = json.loads(raw_message)
            except Exception as e:
                print(f"[WS] ❌ Failed to parse JSON: {e}")
                continue

            if not isinstance(data, dict):
                print("[WS] ⚠️ Message is not a dict, ignoring.")
                continue

            msg_type = data.get("type")

            if msg_type == "chat":
                print(f"[WS] 💬 Chat from {data.get('from')}: {data.get('text')}")
                await notify_clients({
                    "type": "chat",
                    "from": data.get("from"),
                    "text": data.get("text")
                })

            elif msg_type == "move_notification":
                await notify_clients({
                    "type": "info",
                    "text": f"{data.get('player')} made a move: {data.get('move')}"
                })

            else:
                print(f"[WS] ⚠️ Unknown message type: {msg_type}")

    except websockets.exceptions.ConnectionClosed:
        print("[WS] 🔌 Client disconnected.")

    finally:
        connected_clients.discard(websocket)
        print(f"[WS] 👤 Client removed. Remaining: {len(connected_clients)}")

# Запуск сервера
async def main():
    print("[WS] 🚀 Starting WebSocket server on ws://0.0.0.0:6789")
    async with websockets.serve(handle_connection, "0.0.0.0", 6789):
        asyncio.create_task(broadcast_daily_events())
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
