from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional


class StructuredLogger:
    def __init__(self, name: str = 'ai_guardian', log_dir: Optional[str] = None, level: int = logging.INFO) -> None:
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        self.logger.propagate = False

        if not self.logger.handlers:
            formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s %(message)s')
            file_handler = logging.FileHandler(Path(log_dir or Path(__file__).resolve().parents[1] / 'outputs' / 'logs' / 'ai_guardian.log'))
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)

            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(formatter)
            self.logger.addHandler(stream_handler)

    def info(self, message: str) -> None:
        self.logger.info(message)

    def warning(self, message: str) -> None:
        self.logger.warning(message)

    def error(self, message: str) -> None:
        self.logger.error(message)
