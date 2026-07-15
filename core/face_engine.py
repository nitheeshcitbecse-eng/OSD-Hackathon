from __future__ import annotations

from pathlib import Path
from typing import Optional

import cv2
import numpy as np

from domain.models import FaceResult, RecognitionStatus
from enrollment.embedding_store import EmbeddingStore
from utils.config_loader import ConfigLoader
from utils.geometry import clamp_bbox


class FaceEngine:
    def __init__(self, embedding_store: Optional[EmbeddingStore] = None, provider: Optional[object] = None, storage_path: Optional[str] = None, config_path: Optional[str] = None) -> None:
        self.config = ConfigLoader(config_path).get('face', {})
        self.embedding_store = embedding_store or EmbeddingStore(storage_path=storage_path)
        self.provider = provider
        self.authorized_threshold = float(self.config.get('authorized_threshold', 0.5))
        self.uncertain_threshold = float(self.config.get('uncertain_threshold', 0.35))

    def _normalize(self, embedding: np.ndarray) -> np.ndarray:
        embedding = np.asarray(embedding, dtype=float)
        norm = np.linalg.norm(embedding)
        if norm == 0:
            return embedding
        return embedding / norm

    def _best_identity_score(self, embedding: np.ndarray) -> tuple[Optional[str], float]:
        best_identity = None
        best_score = -1.0
        if hasattr(self.embedding_store, 'get_identity_names'):
            identities = self.embedding_store.get_identity_names()
            for identity in identities:
                scores = []
                for candidate in self.embedding_store.get_embeddings_for_identity(identity):
                    similarity = float(np.dot(self._normalize(embedding), self._normalize(candidate)))
                    scores.append(similarity)
                score = max(scores) if scores else -1.0
                if score > best_score:
                    best_score = score
                    best_identity = identity
            return best_identity, best_score

        if isinstance(self.embedding_store, dict):
            for identity, candidates in self.embedding_store.items():
                scores = []
                for candidate in candidates:
                    similarity = float(np.dot(self._normalize(embedding), self._normalize(candidate)))
                    scores.append(similarity)
                score = max(scores) if scores else -1.0
                if score > best_score:
                    best_score = score
                    best_identity = identity
            return best_identity, best_score

        return None, -1.0

    def recognize(self, frame: np.ndarray, bbox: tuple[float, float, float, float]) -> FaceResult:
        if frame is None:
            return FaceResult(identity=None, similarity=0.0, face_detected=False, recognition_status=RecognitionStatus.NO_FACE)
        width = frame.shape[1]
        height = frame.shape[0]
        clamped = clamp_bbox(bbox, width, height)
        if clamped[0] >= clamped[2] or clamped[1] >= clamped[3]:
            return FaceResult(identity=None, similarity=0.0, face_detected=False, recognition_status=RecognitionStatus.NO_FACE)
        x1, y1, x2, y2 = map(int, clamped)
        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return FaceResult(identity=None, similarity=0.0, face_detected=False, recognition_status=RecognitionStatus.NO_FACE)
        if self.provider is None:
            embedding = np.mean(crop, axis=(0, 1)).astype(float)
        else:
            embedding = self.provider.embed(crop)
        identity, similarity = self._best_identity_score(embedding)
        if similarity <= 0.0:
            status = RecognitionStatus.NO_FACE
        elif identity is not None and str(identity).strip().lower() == 'unknown':
            status = RecognitionStatus.UNKNOWN
        elif similarity >= self.authorized_threshold:
            status = RecognitionStatus.AUTHORIZED
        elif similarity >= self.uncertain_threshold:
            status = RecognitionStatus.IDENTITY_UNCERTAIN
        else:
            status = RecognitionStatus.UNKNOWN
        return FaceResult(identity=identity, similarity=similarity, face_detected=True, recognition_status=status)
