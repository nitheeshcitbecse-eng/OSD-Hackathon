import numpy as np

from core.face_engine import FaceEngine
from domain.models import FaceResult, RecognitionStatus


class FakeProvider:
    def __init__(self):
        self.embedding = np.array([1.0, 0.0, 0.0], dtype=float)

    def embed(self, image):
        return self.embedding


def test_authorized_and_unknown_scores(tmp_path):
    store = {}
    provider = FakeProvider()
    engine = FaceEngine(embedding_store=None, provider=provider, storage_path=str(tmp_path / 'embeddings.npz'))
    engine.embedding_store = store

    store['taran'] = [np.array([1.0, 0.0, 0.0], dtype=float)]
    result = engine.recognize(np.zeros((64, 64, 3), dtype=np.uint8), (0, 0, 20, 20))
    assert result.recognition_status == RecognitionStatus.AUTHORIZED

    store['unknown'] = [np.array([0.0, 1.0, 0.0], dtype=float)]
    provider.embedding = np.array([0.0, 1.0, 0.0], dtype=float)
    result = engine.recognize(np.zeros((64, 64, 3), dtype=np.uint8), (0, 0, 20, 20))
    assert result.recognition_status == RecognitionStatus.UNKNOWN
