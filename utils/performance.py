from __future__ import annotations

import time
from collections import deque
from statistics import mean
from typing import Deque, Dict, List


class PerformanceProfiler:
    def __init__(self) -> None:
        self._timings: Dict[str, Deque[float]] = {name: deque(maxlen=200) for name in ['camera', 'detection', 'face', 'memory', 'behavior', 'context', 'threat', 'frame']}
        self._start = time.perf_counter()

    def record(self, stage: str, duration_ms: float) -> None:
        if stage in self._timings:
            self._timings[stage].append(duration_ms)

    def summary(self) -> Dict[str, float]:
        result: Dict[str, float] = {}
        for stage, values in self._timings.items():
            if values:
                result[f'{stage}_avg_ms'] = round(mean(values), 2)
        if result:
            result['fps'] = round(1000.0 / max(result.get('frame_avg_ms', 1.0), 1e-6), 2)
        return result
