#!/bin/bash
# filepath: c:\Users\msjac\GitHub\aws-devops-demo\codebuild.sh

set -e

BUILDSPEC=${1:-buildspec.yml}
ARTIFACTS_DIR=./artifacts

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$PWD":/LocalBuild/env \
  -e "IMAGE_NAME=aws/codebuild/standard:7.0" \
  -e "ARTIFACTS=$ARTIFACTS_DIR" \
  amazon/aws-codebuild-local:latest \
  -i aws/codebuild/standard:7.0 \
  -a $ARTIFACTS_DIR \
  -s /LocalBuild/env \
  -b $BUILDSPEC