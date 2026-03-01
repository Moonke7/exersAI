#!/bin/bash

# Directorios principales
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
ADMIN_WEB_DIR="$ROOT_DIR/apps/admin-web"
STORE_ID="9928b811b15f4732b0eb91a5ded9cccc"

# Load environment variables from .env
if [ -f .env ]; then
    echo -e "${YELLOW}Loading environment variables from .env...${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo "Warning: .env file not found. Using default values."
fi

create_secret() {
    local name=$1
    local value=$2
    local dir=$3
    
    echo "➡️  Setting secret: $name"
    # Using --config to point to the wrangler.jsonc file
    npx wrangler secrets-store secret create "$STORE_ID" --name "$name" --value "$value" --scopes "workers" --config "$dir/wrangler.jsonc" --persist-to "$dir/.wrangler/state"
}

# Nos paramos en el directorio raíz para mayor consistencia
cd "$ROOT_DIR" || exit 1

echo "☁️  Guardando secrets en el secrets-store (.wrangler/state) para admin-web..."

create_secret "DEEPSEEK_API_KEY" "$DEEPSEEK_API_KEY" "$ADMIN_WEB_DIR"
create_secret "SUPABASE_KEY" "$SUPABASE_KEY" "$ADMIN_WEB_DIR"
create_secret "SUPABASE_URL" "$SUPABASE_URL" "$ADMIN_WEB_DIR"

echo "✅ Proceso finalizado exitosamente."
