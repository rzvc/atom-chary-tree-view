let treeView;
let dblClickHandler;

module.exports = {
  activate: () => {
    atom.packages
      .activatePackage('tree-view')
      .then(treeViewPkg => {
        treeView = treeViewPkg.mainModule.createView();

        treeView.oldEntryClicked = treeView.entryClicked;

        const isDirectoryElements = element =>
          element.classList.contains('directory') ||
          element.parentNode.classList.contains('directory') ||
          element.parentNode.parentNode &&
          element.parentNode.parentNode.classList.contains('directory');

        const isOneOfThoseElements = element =>
          (element.classList.contains('entry') ||
          element.parentNode.classList.contains('entry') ||
          element.parentNode.parentNode &&
          element.parentNode.parentNode.classList.contains('entry')) &&
          (!atom.config.get('chary-tree-view.dirSingleClick') ||
            !isDirectoryElements(element));

        treeView.entryClicked = e =>
          !isOneOfThoseElements(e.target) &&
          treeView.oldEntryClicked.call(treeView, e);

        dblClickHandler = e =>
          isOneOfThoseElements(e.target) &&
          treeView.oldEntryClicked.call(treeView, e);

        treeView.element.addEventListener('dblclick', dblClickHandler)
      })
  },

  deactivate: () => {
    treeView.element.removeEventListener('dblclick', dblClickHandler)
    delete treeView.oldEntryClicked;

    treeView = undefined;
    dblClickHandler = undefined;
  },

  config: {
    dirSingleClick: {
      title: 'Expand Folders With Single Click',
      description: 'Expand folders in the ordinary way.',
      type: 'boolean',
      default: true,
    }
  }
};
