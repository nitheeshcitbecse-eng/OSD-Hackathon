from __future__ import annotations

import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import requests

from utils.config_loader import ConfigLoader
from utils.logger import StructuredLogger


class AlertDispatcher:
    def __init__(self, config_path: str | None = None, logger: Optional[StructuredLogger] = None) -> None:
        self.config = ConfigLoader(config_path).get('backend', {})
        self.logger = logger or StructuredLogger('ai_guardian.alerts')
        self.session = requests.Session()
        self.retry_queue_dir = Path(self.config.get('retry_queue_directory', 'data/retry_queue'))
        self.retry_queue_dir.mkdir(parents=True, exist_ok=True)
        self.max_retries = int(self.config.get('max_retries', 3))
        self.timeout = float(self.config.get('timeout_seconds', 5))
        self.backoff = float(self.config.get('retry_backoff_seconds', 2))

    def dispatch(self, payload: Dict[str, Any]) -> bool:
        api_key = os.getenv('AI_GUARDIAN_ML_API_KEY', '')
        headers = {'Content-Type': 'application/json', 'X-ML-API-Key': api_key}
        try:
            response = self.session.post(self.config.get('alert_url', 'http://localhost:8000/api/alerts/trigger'), json=payload, headers=headers, timeout=self.timeout)
            response.raise_for_status()
            self.logger.info(f'Alert dispatched: {payload.get("event_id")}')
            return True
        except Exception as exc:
            self.logger.error(f'Alert failed: {exc}')
            self._queue(payload)
            return False

    def _queue(self, payload: Dict[str, Any]) -> None:
        event_id = payload.get('event_id', f'event-{int(time.time())}')
        queue_path = self.retry_queue_dir / f'{event_id}.json'
        queue_path.write_text(json.dumps(payload), encoding='utf-8')

    def retry_queued(self) -> int:
        success_count = 0
        for path in sorted(self.retry_queue_dir.glob('*.json')):
            payload = json.loads(path.read_text(encoding='utf-8'))
            if self.dispatch(payload):
                path.unlink(missing_ok=True)
                success_count += 1
        return success_count
