cd /home/ec2-user/repo/Otherworld
git stash
git pull
sudo npx tsc
sudo npm run ppack
sudo pm2 restart all