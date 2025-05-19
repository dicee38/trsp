# utils/cache.py

import json
import os
from collections import deque

CACHE_FILE = "event_cache.json"
MAX_EVENTS = 50

class EventCache:
    def __init__(self, path=CACHE_FILE, limit=MAX_EVENTS):
        self.path = path
        self.limit = limit
        self.events = deque(maxlen=limit)
        self._load()

    def _load(self):
        if os.path.exists(self.path):
            try:
                with open(self.path, "r") as f:
                    self.events = deque(json.load(f), maxlen=self.limit)
            except:
                self.events = deque(maxlen=self.limit)

    def add_event(self, event):
        self.events.append(event)
        self._save()

    def get_events(self):
        return list(self.events)

    def _save(self):
        with open(self.path, "w") as f:
            json.dump(list(self.events), f, indent=2)

# Пример использования:
if __name__ == "__main__":
    cache = EventCache()
    cache.add_event({"type": "chat", "from": "user", "text": "Привет"})
    cache.add_event({"type": "event", "text": "Выпал артефакт"})
    print(cache.get_events())
