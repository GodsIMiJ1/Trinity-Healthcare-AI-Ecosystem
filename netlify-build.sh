#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="${ROOT_DIR}/public"

rm -rf "${PUBLIC_DIR}"
mkdir -p "${PUBLIC_DIR}"

cp "${ROOT_DIR}/index.html" "${PUBLIC_DIR}/index.html"
cp "${ROOT_DIR}/landing.css" "${PUBLIC_DIR}/landing.css"
cp "${ROOT_DIR}/_redirects" "${PUBLIC_DIR}/_redirects"

build_app() {
  local app_dir="$1"
  local base_path="/${app_dir}/"

  pushd "${ROOT_DIR}/${app_dir}" >/dev/null
  npm install
  VITE_BASE="${base_path}" npm run build
  popd >/dev/null

  mkdir -p "${PUBLIC_DIR}/${app_dir}"
  cp -R "${ROOT_DIR}/${app_dir}/dist/." "${PUBLIC_DIR}/${app_dir}/"
}

build_app "clinic-os"
build_app "ghostvault-sovereign-console"
build_app "with-me-still-main"
