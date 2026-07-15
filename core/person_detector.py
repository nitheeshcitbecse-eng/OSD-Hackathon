from __future__ import annotations

from typing import List, Optional, Tuple

import cv2
import numpy as np

from domain.models import PersonDetection
from utils.config_loader import ConfigLoader


class PersonDetector:
    def __init__(self, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('detection', {})
        self.model = None
        self.tracker = self.config.get('tracker', 'bytetrack.yaml')
        self.confidence_threshold = float(self.config.get('confidence_threshold', 0.5))
        self.person_class_id = int(self.config.get('person_class_id', 0))

    def load_model(self) -> None:
        try:
            from ultralytics import YOLO
        except Exception:
            self.model = None
            return
        self.model = YOLO(self.config.get('model', 'yolo11n.pt'))

    def detect(self, frame: np.ndarray) -> List[PersonDetection]:
        if self.model is None:
            self.load_model()
        if self.model is None:
            return []
        results = self.model.track(
            frame,
            persist=True,
            classes=[self.person_class_id],
            tracker=self.tracker,
            conf=self.confidence_threshold,
            stream=False,
        )
        detections: List[PersonDetection] = []
        if not results:
            return detections
        result = results[0]
        for box in getattr(result, 'boxes', []) or []:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            if conf < self.confidence_threshold:
                continue
            track_id = None
            if hasattr(box, 'id') and box.id is not None:
                track_id = int(box.id[0])
            center = ((x1 + x2) / 2.0, (y1 + y2) / 2.0)
            detections.append(PersonDetection(track_id=track_id, bbox=(x1, y1, x2, y2), confidence=conf, center_point=center))
        return detections


def annotate_frame(frame: np.ndarray, detections: List[PersonDetection]) -> np.ndarray:
    annotated = frame.copy()
    for detection in detections:
        x1, y1, x2, y2 = detection.bbox
        cv2.rectangle(annotated, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(annotated, f'PERSON {detection.track_id or "-"}', (int(x1), max(0, int(y1) - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        cv2.putText(annotated, f'CONF {detection.confidence:.2f}', (int(x1), int(y1) + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    return annotated
