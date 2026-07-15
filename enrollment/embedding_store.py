from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List

import numpy as np


class EmbeddingStore:
    def __init__(self, storage_path: str | None = None) -> None:
        self.storage_path = Path(storage_path or Path(__file__).resolve().parents[1] / 'data' / 'embeddings' / 'embeddings.npz')
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self.embeddings: Dict[str, List[np.ndarray]] = {}
        self.load()

    def save(self, identity: str, embedding: np.ndarray) -> None:
        embedding = np.asarray(embedding, dtype=float)
        if identity not in self.embeddings:
            self.embeddings[identity] = []
        self.embeddings[identity].append(embedding / (np.linalg.norm(embedding) or 1.0))
        self._persist()

    def load(self) -> None:
        if not self.storage_path.exists():
            self.embeddings = {}
            return
        data = np.load(self.storage_path, allow_pickle=True)
        self.embeddings = {
            key: [np.asarray(value, dtype=float) for value in data[key]] for key in data.files
        }

    def _persist(self) -> None:
        np.savez(self.storage_path, **{key: np.stack(values) for key, values in self.embeddings.items()})

    def get_identity_names(self) -> List[str]:
        return sorted(self.embeddings.keys())

    def get_embeddings_for_identity(self, identity: str) -> List[np.ndarray]:
        return self.embeddings.get(identity, [])
