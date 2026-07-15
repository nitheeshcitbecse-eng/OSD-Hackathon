from __future__ import annotations

import cv2
import numpy as np

from domain.models import VisionQuality


class VisionQualityEngine:
    def analyze(self, frame: np.ndarray, person_crop: np.ndarray | None = None, face_crop: np.ndarray | None = None) -> VisionQuality:
        if frame is None:
            return VisionQuality()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        brightness = float(gray.mean())
        lap = cv2.Laplacian(gray, cv2.CV_64F)
        blur_score = float(lap.var())
        blur_detected = blur_score < 100.0
        person_crop_size = person_crop.size if person_crop is not None else 0
        face_crop_size = face_crop.size if face_crop is not None else 0
        face_too_small = face_crop_size < 2500
        low_light = brightness < 80.0
        overall_quality_score = 1.0 - (0.2 if low_light else 0.0) - (0.3 if blur_detected else 0.0) - (0.2 if face_too_small else 0.0)
        overall_quality_score = max(0.0, min(1.0, overall_quality_score))
        if overall_quality_score >= 0.8:
            quality_level = 'GOOD'
        elif overall_quality_score >= 0.4:
            quality_level = 'DEGRADED'
        else:
            quality_level = 'POOR'
        return VisionQuality(
            frame_brightness=brightness,
            low_light=low_light,
            blur_score=blur_score,
            blur_detected=blur_detected,
            person_crop_size=person_crop_size,
            face_crop_size=face_crop_size,
            face_too_small=face_too_small,
            overall_quality_score=overall_quality_score,
            quality_level=quality_level,
        )
