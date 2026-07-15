from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import yaml


class ConfigLoader:
    def __init__(self, config_path: str | None = None) -> None:
        self.config_path = Path(config_path or Path(__file__).resolve().parents[1] / 'config' / 'settings.yaml')
        self._config: Dict[str, Any] = {}
        self.load()

    def load(self) -> Dict[str, Any]:
        with self.config_path.open('r', encoding='utf-8') as handle:
            self._config = yaml.safe_load(handle) or {}
        return self._config

    def get(self, key: str, default: Any = None) -> Any:
        value = self._config
        for part in key.split('.'):
            if isinstance(value, dict) and part in value:
                value = value[part]
            else:
                return default
        return value
