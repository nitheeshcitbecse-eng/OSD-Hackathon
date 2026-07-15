from enrollment.embedding_store import EmbeddingStore
import numpy as np


def test_save_and_load_embeddings(tmp_path):
    store = EmbeddingStore(storage_path=str(tmp_path / 'embeddings.npz'))
    store.save('taran', np.array([0.1, 0.2, 0.3]))
    store.save('taran', np.array([0.4, 0.5, 0.6]))

    loaded = EmbeddingStore(storage_path=str(tmp_path / 'embeddings.npz'))
    loaded.load()

    assert 'taran' in loaded.get_identity_names()
    assert len(loaded.get_embeddings_for_identity('taran')) == 2
