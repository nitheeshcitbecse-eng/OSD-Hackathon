import numpy as np

from core.camera import Camera


def test_invalid_source_returns_none():
    camera = Camera(source='invalid-source')
    frame = camera.read()
    assert frame is None


def test_release_clears_capture():
    camera = Camera(source=0)
    camera.release()
    assert camera.capture is None
