const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const createNewProject = async () => {
  execSync(`git clone https://github.com/tyhopp/basework-example`, {
    stdio: [0, 1, 2], // Show output
    cwd: path.resolve('.'), // Path to resolve the file
  })
}

module.exports = {
  createNewProject
}