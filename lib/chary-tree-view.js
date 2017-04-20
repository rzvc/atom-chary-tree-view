let treeView;
let dblClickHandler;

module.exports = {
  activate: () =>
    atom.packages
      .activatePackage('tree-view')
      .then(treeViewPkg => {
        treeView = treeViewPkg.mainModule.createView();

        treeView.oldEntryClicked = treeView.entryClicked;

        const isOneOfThoseElements = element =>
          element.classList.contains('entry') ||
          element.parentNode.classList.contains('entry') ||
          element.parentNode.parentNode && element.parentNode.parentNode.classList.contains('entry');

        treeView.entryClicked = e => !isOneOfThoseElements(e.target) &&
          treeView.oldEntryClicked.call(treeView, e);

        dblClickHandler = e => isOneOfThoseElements(e.target) &&
          treeView.oldEntryClicked.call(treeView, e);

        treeView.element.addEventListener('dblclick', dblClickHandler)
      }),

  deactivate: () => {
    treeView.element.removeEventListener('dblclick', dblClickHandler)
    delete treeView.oldEntryClicked;

    treeView = undefined;
    dblClickHandler = undefined;
  },
};