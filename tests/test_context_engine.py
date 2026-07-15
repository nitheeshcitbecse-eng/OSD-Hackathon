from datetime import datetime

from core.context_engine import ContextEngine


def test_restricted_hour_after_midnight():
    engine = ContextEngine()
    context = engine.analyze(datetime(2026, 1, 2, 2, 30))
    assert context.is_restricted_hour is True


def test_daytime_not_restricted():
    engine = ContextEngine()
    context = engine.analyze(datetime(2026, 1, 2, 12, 0))
    assert context.is_restricted_hour is False
