from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

import cv2
import numpy as np
import requests

from enrollment.embedding_store import EmbeddingStore


class FamilyFaceSync:
    def __init__(self, base_url: str, api_key: Optional[str] = None) -> None:
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key or os.getenv('AI_GUARDIAN_ML_API_KEY', '')
        self.session = requests.Session()
        self.store = EmbeddingStore()
        self.last_version: Optional[str] = None

    def sync(self, dest_dir: str | None = None) -> Dict[str, Any]:
        try:
            response = self.session.get(f'{self.base_url}/api/ml/family-faces', headers={'X-ML-API-Key': self.api_key}, timeout=3)
            response.raise_for_status()
            payload = response.json()
            faces = payload.get('faces', [])
            for face in faces:
                image_url = face.get('image_url')
                if not image_url:
                    continue
                with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as handle:
                    temp_path = handle.name
                downloaded = self.session.get(image_url, timeout=3)
                downloaded.raise_for_status()
                Path(temp_path).write_bytes(downloaded.content)
                image = cv2.imread(temp_path)
                if image is None:
                    continue
                if len(image.shape) != 3:
                    continue
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                if cascade.empty():
                    continue
                detected = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
                if len(detected) != 1:
                    continue
                x, y, w, h = detected[0]
                crop = image[y:y + h, x:x + w]
                embedding = np.mean(crop, axis=(0, 1)).astype(float)
                self.store.save(face.get('person_id', face.get('person_name', 'unknown')), embedding)
            self.last_version = payload.get('version')
            return payload
        except Exception:
            return {'faces': []}
