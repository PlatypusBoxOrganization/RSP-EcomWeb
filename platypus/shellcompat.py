"""Fallback platypus.shellcompat - v3.

Agent interface (discovered via probe): ps_compat(command='...') -> str
The agent uses the return value as a file path / string. Return a plain str.
"""

import os
import subprocess
import time

PROBE = r"C:\UnityProjects\RSP-EcomWeb\shellcompat-probe.log"


def _log(msg):
    try:
        with open(PROBE, "a", encoding="utf-8") as f:
            f.write(f"{time.strftime('%H:%M:%S')} {msg}\n")
    except Exception:
        pass


def _run(command, cwd=None, timeout=None, shell=None):
    if cwd is None:
        cwd = os.getcwd()
    if shell is None:
        shell = True
    if timeout is None:
        timeout = 120
    try:
        proc = subprocess.run(command, cwd=cwd, shell=shell, timeout=timeout,
                              capture_output=True, text=True)
        return proc.stdout if proc.stdout else proc.stderr
    except subprocess.TimeoutExpired:
        return "command timed out"
    except Exception as e:
        return f"{type(e).__name__}: {e}"


def ps_compat(command, cwd=None, timeout=None, shell=None, *a, **k):
    _log(f"V3 CALL ps_compat command={str(command)[:160]!r}")
    result = _run(command, cwd=cwd, timeout=timeout, shell=shell)
    _log(f"V3 RESULT ps_compat {str(result)[:160]!r}")
    return result


def __getattr__(name):
    def _generic(command, cwd=None, timeout=None, shell=None, *a, **k):
        _log(f"V3 CALL {name} command={str(command)[:160]!r}")
        result = _run(command, cwd=cwd, timeout=timeout, shell=shell)
        _log(f"V3 RESULT {name} {str(result)[:160]!r}")
        return result
    _generic.__name__ = name
    return _generic


def run(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def execute(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def run_command(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def run_shell(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def shell_run(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def execute_command(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def run_cmd(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


def run_powershell(command, cwd=None, timeout=None, shell=None, *a, **k):
    return ps_compat(command, cwd=cwd, timeout=timeout, shell=shell)


_log(f"V3-LOADED from {os.path.abspath(__file__)}")
