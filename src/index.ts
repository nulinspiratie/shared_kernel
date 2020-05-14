import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { INotebookTracker} from '@jupyterlab/notebook'
import { ICommandPalette } from '@jupyterlab/apputils';
// import {ManagerBase} from "@jupyter-widgets/base/lib/manager-base";
// import {WidgetManager} from "@jupyter-widgets/jupyterlab-manager";
import { patch_ipywidgets } from './patch_functions'
import { ButtonExtension } from './button_extension'

/**
 * Initialization data for the shared_kernel extension.
 */

const extension: JupyterFrontEndPlugin<void> = {
  id: 'shared_kernel',
  autoStart: true,
  requires: [INotebookTracker, ICommandPalette],
  activate: (app: JupyterFrontEnd, notebooks: INotebookTracker, palette: ICommandPalette) => {

    patch_ipywidgets();

    console.log('Adding button');
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());

    // Study KernelNameComponent for proper way to have share kernel button

    console.log(notebooks);

    // Access notebook panels
    let notebooks_list = [];
    notebooks.forEach(notebook => notebooks_list.push(notebook));

    // notebooks.currentWidget.sessionContext.session
    // ISessionContext.kernelChanged.connect(function() {console.log('kernel changed')})

    console.log('JupyterLab extension shared_kernel is activated!');


  }
};

export default extension;
