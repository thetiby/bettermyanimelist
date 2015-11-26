/* global Window, ObjectUtils */

(function () {
    /*
     * BASIC - Basic properties are Element properties.
     * SPECIAL -  
     * ARRAY -  
     * PARENT -
     */
     var PROPERTY_PREFIXE = {
        PARENT: '$$',
        ARRAY: '$_',
        SPECIAL: '$',
        BASIC: ''
    };
    var ACTION = {
        CREATE: 0,
        UPDATE: 1,
        CLONE: 2,
        MODEL: 3,
        REMOVE: 4,
        WRAP: 5,
        REPLACE: 6,
        ACTIONS: 7
    };
    var REGISTER = {
        ACTIONS: [],
        MODELS: []
    };
    function _parseUIObjects(action) {
        for (var i = 0; i < action.uiObjects.length; i++) {
            var uiObject = action.uiObjects[i];
        }
    }
    /*
     * Parses action
     * @param {object} action
     */
     function _parseAction(action, processing) {
        if (action.action == ACTIONS.MODEL) {
            /*
             * The action is a model.
             * The action is added to the models' register so that it can be later rendered if needed.
             */
             REGISTER.MODELS[action.params.modelName] = {action: action};
         } else if (action.params.actionName && !processing) {
            /*
             * The action has a name and isn't being processed.
             * The action is added to the actions' register so that it can be later processed if needed.
             */
             REGISTER.ACTIONS[action.params.actionName] = {action: action, persistent: true};
             if (action.params.process) {
                /*
                 * In addition to be registered, the action need to be immediately processed.
                 * The action is processed.
                 */
                 this.process(action.params.actionName, true);
             }
         } if(action.action == ACTIONS.ACTIONS) {
            /*
             * The action is a group of actions.
             * Each of these action is parsed one after another.
             */
             for (var i = 0; i < action.uiObjects.length) {
                var action = action.uiObjects[i];
                _parseAction({uiObjects: action.uiObjects, params: action.params || {}, action: ACTIONS[action.action]});
            };
        } else {
            /*
             * The action is either not a model or doesn't have a name or the action is being processed
             * The action is parsed.
             */
             _parseUIObjects(action);
         }
         return uiObjects;
     }
    /*
     * Render a model
     * @param {string} modelName
     * @param {object} data
     * @param {boolean} asChildren
     * @return Returns UI objects.
     */
     this.render = function (modelName, data) {
        var uiObjects = [];
        data.forEach(function (data, index) {
            uiObjects.push(REGISTER.MODELS[modelName].action.model(data, index));
        });
        return _parseAction({
            uiObjects: uiObjects,
            params: REGISTER.MODELS[modelName].action.params,
            action: ACTIONS.CREATE
        });gf
    };
    /*
     * Processes given registered action
     * @param {string} registerName
     * @param {boolean} persistent
     */
     this.process = function (actionName, persistent) {
        var action = REGISTER.ACTIONS[actionName];
        if (action) {
            _parseAction(action.action, true);
            var actions = action.action.params.actions;
            if (actions) {
                for (var i = 0; i < actions.length; i++) {
                    this.process(actions[i], true);
                }
            }
            if (!persistent) {
                delete action;
            }
        }
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.create = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.CREATE});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.update = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.UPDATE});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.clone = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.CLONE});
    };
    /*
     * Parses given action
     * @param {object} model
     * @param {object} params
     */
     this.model = function (model, params) {
        _parseAction({model: model, params: params || {}, action: ACTIONS.MODEL});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.remove = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.REMOVE});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.wrap = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.WRAP});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.replace = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.REPLACE});
    };
    /*
     * Parses given action
     * @param {object} uiObjects
     * @param {object} params
     */
     this.actions = function (uiObjects, params) {
        _parseAction({uiObjects: uiObjects, params: params || {}, action: ACTIONS.ACTIONS});
    };
}).call(UserInterface = {});
