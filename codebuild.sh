#!/bin/bash
# filepath: c:\Users\msjac\GitHub\aws-devops-demo\codebuild.sh

set -e

BUILDSPEC=${1:-buildspec.yml}
ARTIFACTS_DIR=./artifacts

# Use $WORKSPACE if set (Jenkins), else fallback to $PWD
WORKDIR=$(pwd)

# Print and check WORKDIR
echo "WORKDIR is: '$WORKDIR'"
if [ -z "$WORKDIR" ]; then
  echo "ERROR: WORKDIR is empty. Please check your Jenkins agent configuration."
  exit 1
fi

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$WORKDIR":/LocalBuild/env \
  -e "IMAGE_NAME=aws/codebuild/standard:7.0" \
  -e "ARTIFACTS=$ARTIFACTS_DIR" \
  amazon/aws-codebuild-local:latest \
  -i aws/codebuild/standard:7.0 \
  -a $ARTIFACTS_DIR \
  -s /LocalBuild/env \
  -b $BUILDSPEC