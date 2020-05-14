import {
  IDisposable, DisposableDelegate
} from '@lumino/disposable';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  // NotebookActions,
  NotebookPanel,
  INotebookModel
} from '@jupyterlab/notebook';

import { consoleIcon } from '@jupyterlab/ui-components'



export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      console.log('Sharing kernel (not operational');
      // NotebookActions.runAll(panel.content, context.sessionContext);
    };
    let button = new ToolbarButton({
      className: 'shareKernel',
      icon: consoleIcon,
      onClick: callback,
      tooltip: 'Share kernel',
      enabled: false
    });

    console.log(button)

    panel.toolbar.addItem('shareKernel', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}
