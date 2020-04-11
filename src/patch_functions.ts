import {ManagerBase} from "@jupyter-widgets/base/lib/manager-base";
import {WidgetManager} from "@jupyter-widgets/jupyterlab-manager";


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
