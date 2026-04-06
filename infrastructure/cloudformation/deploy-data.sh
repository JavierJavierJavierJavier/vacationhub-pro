#!/usr/bin/env bash
#
# Deploy the VacationHub data-infrastructure CloudFormation stack
# (Aurora Serverless v2 PostgreSQL, Security Groups).
#
# Usage:
#   ./deploy-data.sh
#
# Prerequisites:
#   - AWS CLI configured with correct credentials
#   - Target VPC and subnets must exist

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="${SCRIPT_DIR}/data.yaml"
STACK_NAME="vacationhub-data-prod"
REGION="eu-west-1"
EXPECTED_ACCOUNT="444866822933"

# --- Known infrastructure (same VPC as alter5 platform) ---
VPC_ID="vpc-0b3b008f35eb0f7e1"
SUBNET_IDS="subnet-0a67399ea6d234fa8,subnet-083bdf340d5656283,subnet-0a5fb415679bdedcd"

# --- Verify AWS account ---
ACTUAL_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
if [[ "$ACTUAL_ACCOUNT" != "$EXPECTED_ACCOUNT" ]]; then
  echo "Error: Wrong AWS account. Expected ${EXPECTED_ACCOUNT}, got ${ACTUAL_ACCOUNT}"
  exit 1
fi

echo "=== Deploying ${STACK_NAME} ==="
echo "Region:  ${REGION}"
echo "VPC:     ${VPC_ID}"
echo "Subnets: ${SUBNET_IDS}"
echo ""

PARAMS=(
  "Environment=prod"
  "VpcId=${VPC_ID}"
  "SubnetIds=${SUBNET_IDS}"
  "DBName=vacationhub"
  "DBMasterUsername=vacationhub"
)

echo "=== Running CloudFormation deploy ==="

aws cloudformation deploy \
  --template-file "$TEMPLATE" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --parameter-overrides "${PARAMS[@]}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset

echo ""
echo "=== Stack outputs ==="
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs' \
  --output table

echo ""
echo "=== Done ==="
echo ""
echo "Next steps:"
echo "  1. Note the ClusterEndpoint and MasterSecretArn from outputs above"
echo "  2. Retrieve the auto-generated password:"
echo "     aws secretsmanager get-secret-value --secret-id <MasterSecretArn> --region ${REGION}"
echo "  3. Build your DATABASE_URL:"
echo "     postgresql://vacationhub:<password>@<ClusterEndpoint>:5432/vacationhub?sslmode=require"
