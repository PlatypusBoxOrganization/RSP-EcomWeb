import sys, os
# Ensure the project root is on sys.path so that local modules (e.g., platypus) can be imported
project_root = os.path.abspath(os.path.dirname(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
