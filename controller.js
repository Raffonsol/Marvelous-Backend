const controller = {};
controller.formatTasks = (status, tasks) => {
  let formattedResults = tasks;
  if (status === 'Done') {
    // If it's status=done, only show the 10 most recently completed
    formattedResults = formattedResults.sort((a, b) => a.updated_at < b.updated_at).reverse();
    formattedResults = formattedResults.slice(0, 10);
  }
  // alphabetical sorting
  return formattedResults.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = controller;