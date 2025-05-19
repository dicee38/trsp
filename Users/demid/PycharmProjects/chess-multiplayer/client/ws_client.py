import sys
import os
import asyncio
import websockets
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utils')))
from cache import EventCache

cache = EventCache()

async def listen(uri, username):
    try:
        async with websockets.connect(uri, ping_interval=None) as websocket:

            async def receive():
                while True:
                    try:
                        msg = await websocket.recv()

                        try:
                            data = json.loads(msg)
                            if isinstance(data, str):
                                data = json.loads(data)
                        except:
                            continue

                        if not isinstance(data, dict):
                            continue

                        cache.add_event(data)

                        msg_type = data.get("type")
                        if msg_type == "chat":
                            print(f"[Чат] {data.get('from')}: {data.get('text')}")
                        elif msg_type == "event":
                            print(f"[Событие дня] {data.get('text')} @ {data.get('timestamp')}")
                        elif msg_type == "info":
                            print(f"[Инфо] {data.get('text')}")

                    except:
                        break

            async def send():
                while True:
                    try:
                        text = input("Чат >> ").strip()
                        if text:
                            await websocket.send(json.dumps({
                                "type": "chat",
                                "from": username,
                                "text": text
                            }))
                    except:
                        break

            print("\n💾 Последние события:")
            for event in cache.get_events():
                t = event.get("type")
                if t == "chat":
                    print(f"[Чат] {event.get('from')}: {event.get('text')}")
                elif t == "event":
                    print(f"[Событие дня] {event.get('text')} @ {event.get('timestamp')}")
                elif t == "info":
                    print(f"[Инфо] {event.get('text')}")

            await asyncio.gather(
                asyncio.create_task(receive()),
                asyncio.create_task(send())
            )

    except:
        print("[Ошибка] Подключение к серверу не удалось.")

if __name__ == "__main__":
    name = input("Ваш ник: ")
    asyncio.run(listen("ws://localhost:6789", name))
