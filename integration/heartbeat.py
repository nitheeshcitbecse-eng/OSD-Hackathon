from __future__ import annotations

import os
import threading
import time
from typing import Any, Dict, Optional

import requests


class HeartbeatService:
    def __init__(self, base_url: str, api_key: Optional[str] = None, interval_seconds: float = 10.0) -> None:
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key or os.getenv('AI_GUARDIAN_ML_API_KEY', '')
        self.interval_seconds = interval_seconds
        self.session = requests.Session()
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=1)

    def _loop(self) -> None:
        while not self._stop_event.is_set():
            self.send({'service_id': 'AI_GUARDIAN_EDGE_01', 'ml_status': 'RUNNING'})
            self._stop_event.wait(self.interval_seconds)

    def send(self, payload: Dict[str, Any]) -> None:
        try:
            self.session.post(f'{self.base_url}/api/ml/heartbeat', json=payload, headers={'X-ML-API-Key': self.api_key}, timeout=2)
        except Exception:
            return
