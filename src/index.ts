import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { INotebookTracker} from '@jupyterlab/notebook';
import {ManagerBase} from "@jupyter-widgets/base/lib/manager-base";
import {WidgetManager} from "@jupyter-widgets/jupyterlab-manager";
/**
 * Initialization data for the shared_kernel extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'shared_kernel',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebooks: INotebookTracker) => {
    /**
     * IPywidgets is currently not able to display widgets on a second notebook
     * that is connected to the kernel of another notebook. The problem is that
     * each notebook has its own WidgetManager, and new widgets are only
     * registered with the primary WidgetManager.
     *
     * Here we patch two functions to resolve this issue.
     * the first patch is to ManagerBase.register_model, which is called when a
     * new widget is created. We patch it to also register the WidgetManager
     * as a global variable.
     * This ensures we can access WidgetManagers from other WidgetManagers
     *
     * The second patch is to ManagerBase.get_model, which is called whenever
     * a widget is requested. If this function is called from the second
     * notebook, it won't find the widget because it isn't registered.
     * Here we modify it to also search all other WidgetManagers, and return
     * the widget model if it exists in any other one.
     */

    // Here we patch ManagerBase.register_model to also store the WidgetManager
    // as a global variable in window.widget_managers
    console.log('Adding WidgetManager list to `window`');
    (<any>window).widget_managers = [];

    console.log('Patching ManagerBase.register_model');
    var _original_register_model = ManagerBase.prototype.register_model;
    ManagerBase.prototype.register_model = function (model_id, model_promise) {
      console.log('Called ManagerBase.register_model');

      if (!(<any>window).widget_managers.includes(this)) {
        (<any>window).widget_managers.push(this)
      }
      _original_register_model.apply(this, [model_id, model_promise]);
      let _this = this;
      (<any>window).widget_managers.forEach(
          function (wManager: WidgetManager) {
            if (wManager !== _this) {
              wManager.register_model(model_id, model_promise)
            }
          }
      )
    };


    // Here we patch ManagerBase.get_model, such that if the widget model isn't
    // registered with the current WidgetManager, it will also look in other
    // WidgetManagers.
    console.log('Patching ManagerBase.get_model');
    let _original_get_model = ManagerBase.prototype.get_model;
    ManagerBase.prototype.get_model = function (model_id) {
      console.log('Called ManagerBase.get_model');
      let model = _original_get_model.apply(this, [model_id]);
      if (model !== undefined) {
        return model
      } else {
        // Check if model exists in any other WidgetManager
        for (let wManager of (<any>window).widget_managers) {
          model = _original_get_model.apply(wManager, [model_id]);
          if (model !== undefined) {
            return model;
          }
        }
      }
    };

    console.log('Done patching');


    


    console.log('JupyterLab extension shared_kernel is activated!');


  }
};

export default extension;
