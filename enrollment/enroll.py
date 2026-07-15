from __future__ import annotations

import argparse
from pathlib import Path
from typing import List, Tuple

import cv2
import numpy as np

from enrollment.embedding_store import EmbeddingStore


class FaceProvider:
    def __init__(self) -> None:
        self._model = None

    def detect_face(self, image: np.ndarray) -> Tuple[Tuple[int, int, int, int] | None, np.ndarray | None]:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        if face_cascade.empty():
            return None, None
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        if len(faces) != 1:
            return None, None
        x, y, w, h = faces[0]
        bbox = (int(x), int(y), int(x + w), int(y + h))
        crop = image[y:y + h, x:x + w]
        return bbox, crop

    def embed(self, image: np.ndarray) -> np.ndarray:
        if image is None:
            return np.zeros(16, dtype=float)
        return np.mean(image, axis=(0, 1)).astype(float)


def process_family_dir(family_dir: str) -> Tuple[int, int, int, int]:
    store = EmbeddingStore()
    family_path = Path(family_dir)
    images_processed = 0
    images_rejected = 0
    embeddings_generated = 0
    identities_enrolled = 0

    for person_dir in sorted(family_path.iterdir()):
        if not person_dir.is_dir():
            continue
        identity = person_dir.name
        for image_path in sorted(person_dir.iterdir()):
            if not image_path.is_file():
                continue
            images_processed += 1
            image = cv2.imread(str(image_path))
            if image is None:
                images_rejected += 1
                print(f'Rejected {image_path.name}: unreadable image')
                continue
            provider = FaceProvider()
            _, crop = provider.detect_face(image)
            if crop is None:
                images_rejected += 1
                print(f'Rejected {image_path.name}: no single face detected')
                continue
            embedding = provider.embed(crop)
            store.save(identity, embedding)
            embeddings_generated += 1
        identities_enrolled += 1

    print(f'identities discovered: {identities_enrolled}')
    print(f'images processed: {images_processed}')
    print(f'images rejected: {images_rejected}')
    print(f'embeddings generated: {embeddings_generated}')
    print(f'identities enrolled: {identities_enrolled}')
    return images_processed, images_rejected, embeddings_generated, identities_enrolled


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--family-dir', required=True)
    args = parser.parse_args()
    process_family_dir(args.family_dir)


if __name__ == '__main__':
    main()
