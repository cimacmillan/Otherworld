# #!/usr/bin/env bash
# set -e
# echo -e "Default \e[32mGreen"

# GREEN='\033[0;32m'
# NC='\033[0m' # No Color

# printf "${GREEN}Building${NC}...\n"

# npm run build

# printf "${GREEN}Testing...${NC}...\n"

# npm run test

# printf "${GREEN}Webpacking...${NC}...\n"

# npm run pack

# printf "${GREEN}Starting Server...${NC}...\n"

# npm run start 

sudo npx tsc
sudo npm run ppack
sudo pm2 start site/build/server/Run.js --name otherworld 
