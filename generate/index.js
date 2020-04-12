const { createNewProject } = require('./create-new-project');

const generate = async () => {
  await createNewProject();
}

module.exports = {
  generate
}