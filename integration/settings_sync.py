from __future__ import annotations

import os
from typing import Any, Dict, Optional

import requests


class SettingsSync:
    def __init__(self, base_url: str, api_key: Optional[str] = None) -> None:
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key or os.getenv('AI_GUARDIAN_ML_API_KEY', '')
        self.session = requests.Session()
        self.last_valid_config: Dict[str, Any] = {}
        self.version: Optional[str] = None
        self.updated_at: Optional[str] = None

    def sync(self) -> Dict[str, Any]:
        try:
            response = self.session.get(f'{self.base_url}/api/ml/settings', headers={'X-ML-API-Key': self.api_key}, timeout=3)
            response.raise_for_status()
            payload = response.json()
            if not isinstance(payload, dict):
                raise ValueError('Malformed settings payload')
            self.last_valid_config = self._sanitize(payload)
            self.version = payload.get('version') or 'v1'
            self.updated_at = payload.get('updated_at') or 'now'
            return self.last_valid_config
        except Exception:
            return self.last_valid_config

    def _sanitize(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'sensitivity': payload.get('sensitivity', 'MEDIUM'),
            'night_mode': bool(payload.get('night_mode', False)),
            'restricted_hours': payload.get('restricted_hours', {'start': '23:00', 'end': '05:00'}),
            'auto_emergency_timer_seconds': int(payload.get('auto_emergency_timer_seconds', 30)),
            'face_recognition_threshold': float(payload.get('face_recognition_threshold', 0.5)),
        }
