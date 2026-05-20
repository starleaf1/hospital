#!/bin/bash

# ==============================================================================
# SATUSEHAT SANDBOX API TEST SCRIPT (UPDATED)
# ==============================================================================

# 1. Credentials (Remember to use the full copied strings)
CLIENT_ID="Kh6J0eJuBq8OdBprht3XFupiRd6YEhLxjlg3UrUUje9IcKJ3"
CLIENT_SECRET="LjNXC09cI2lqgekoIh5QQvKWbGOwB0EIUFKyyGqX9XKeSkikiZi3NeOBG4rUcYzk"

# Official SATUSEHAT Sandbox Test NIK
TEST_NIK="9271060312000001" 

# Base URLs
AUTH_URL="https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials"
FHIR_BASE_URL="https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1"

echo "--------------------------------------------------"
echo "STEP 1: Requesting OAuth2 Access Token..."
echo "--------------------------------------------------"

AUTH_RESPONSE=$(curl -s --location --globoff "$AUTH_URL" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "client_secret=$CLIENT_SECRET")

# Safe JSON extraction to handle spaces
ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | awk -F'"' '/"access_token"/ {print $4}')

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Failed to retrieve Access Token. Did you hit the 1-minute penalty?"
    echo "Raw Response: $AUTH_RESPONSE"
    exit 1
fi

echo "✅ Token retrieved successfully!"

echo ""
echo "--------------------------------------------------"
echo "STEP 2: Fetching Patient Data via FHIR API..."
echo "--------------------------------------------------"

# The query string MUST be URL-encoded as expected by the FHIR server
# "https://fhir.kemkes.go.id/id/nik|" becomes "https%3A%2F%2Ffhir.kemkes.go.id%2Fid%2Fnik%7C"
URL_ENCODED_SYSTEM="https%3A%2F%2Ffhir.kemkes.go.id%2Fid%2Fnik%7C"

# Execute the GET request using --globoff to prevent URL parsing errors in bash
PATIENT_RESPONSE=$(curl -s --location --globoff "${FHIR_BASE_URL}/Patient?identifier=${URL_ENCODED_SYSTEM}${TEST_NIK}" \
  --header "Authorization: Bearer $ACCESS_TOKEN" \
  --header "Accept: application/json")

echo "✅ Response received from SATUSEHAT:"
echo ""

# Format output nicely if python is installed
if command -v python3 &>/dev/null; then
    echo "$PATIENT_RESPONSE" | python3 -m json.tool
else
    echo "$PATIENT_RESPONSE"
fi

echo ""
echo "--------------------------------------------------"
echo "Done."