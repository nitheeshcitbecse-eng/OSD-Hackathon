from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

import requests

from domain.models import CameraConfig


class CameraSync:
    def __init__(self, base_url: str, api_key: Optional[str] = None) -> None:
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key or os.getenv('AI_GUARDIAN_ML_API_KEY', '')
        self.session = requests.Session()

    def sync(self) -> List[CameraConfig]:
        try:
            response = self.session.get(f'{self.base_url}/api/ml/cameras', headers={'X-ML-API-Key': self.api_key}, timeout=3)
            response.raise_for_status()
            payload = response.json()
            cameras = []
            for item in payload.get('cameras', []):
                cameras.append(CameraConfig(camera_id=item.get('camera_id', 'CAM_01'), name=item.get('name', 'Camera'), zone=item.get('zone', 'GENERIC'), stream_url=item.get('stream_url', '0'), enabled=bool(item.get('enabled', True))))
            return cameras
        except Exception:
            return [CameraConfig(camera_id='CAM_01', name='Local Camera', zone='ENTRANCE', stream_url='0', enabled=True)]
