# sandbox/services/runner.py

import subprocess

def run_code(source_code: str, language: str) -> dict:
    result = subprocess.run(
        ['python3', '-c', source_code],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=5
    )

    return {
        'stdout': result.stdout,
        'stderr': result.stderr,
        'exit_code': result.returncode
    }