const {exec} = require('child_process');

exec(`mkdir ./packages; cd ./packages; git clone https://github.com/SANGET/orion-admin-web-scaffold.git; git clone https://github.com/ukelli/ukelli-ui.git`);