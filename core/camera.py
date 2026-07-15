from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Optional, Tuple

import cv2
import numpy as np

from utils.config_loader import ConfigLoader


class Camera:
    def __init__(self, source: int | str = 0, config_path: str | None = None) -> None:
        self.config = ConfigLoader(config_path).get('camera', {})
        self.source = source
        self.capture: Optional[cv2.VideoCapture] = None
        self.width = 0
        self.height = 0
        self.fps = 0.0
        self._logger = logging.getLogger('ai_guardian.camera')
        self._connect()

    def _connect(self) -> None:
        self.capture = cv2.VideoCapture(self.source)
        if not self.capture.isOpened():
            self._logger.warning('Camera initialization failed for %s', self.source)
            self.capture = None
            return
        self.width = int(self.capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.fps = float(self.capture.get(cv2.CAP_PROP_FPS) or 0.0)
        self._logger.info('Camera connected: %s', self.source)

    def read(self) -> Optional[np.ndarray]:
        if self.capture is None:
            return None
        ok, frame = self.capture.read()
        if not ok or frame is None:
            self._logger.warning('Camera read failed for %s', self.source)
            return None
        width = int(self.config.get('inference_width', 640))
        height = int(self.config.get('inference_height', 480))
        if width and height:
            frame = cv2.resize(frame, (width, height))
        return frame

    def release(self) -> None:
        if self.capture is not None:
            self.capture.release()
        self.capture = None
        self._logger.info('Camera released: %s', self.source)
