#!/bin/bash
set -ev

# Lint Steps
./scripts/run-lint-frontend.sh

# Build Steps
# ./scripts/run-build-go.sh
./scripts/run-build-frontend.sh
