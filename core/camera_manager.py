from __future__ import annotations

from typing import List, Optional

from domain.models import CameraConfig


class CameraManager:
    def __init__(self, cameras: Optional[List[CameraConfig]] = None) -> None:
        self.cameras = cameras or []
        self.active_camera: Optional[CameraConfig] = None
        self._select_active()

    def _select_active(self) -> None:
        for camera in self.cameras:
            if camera.enabled:
                self.active_camera = camera
                return
        self.active_camera = None

    def get_active_camera(self) -> Optional[CameraConfig]:
        return self.active_camera
