/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCFoundation from '@material/base/foundation';
import MDCFormFieldAdapter from './adapter';
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCFormFieldAdapter>}
 */
class MDCFormFieldFoundation extends MDCFoundation {
  /** @return enum {cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {strings} */
  static get strings() {
    return strings;
  }

  /** @return {!MDCFormFieldAdapter} */
  static get defaultAdapter() {
    return {
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      activateInputRipple: () => {},
      deactivateInputRipple: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCFormFieldFoundation.defaultAdapter, adapter));

    /** @private {!EventListener} */
    this.clickHandler_ = /** @type {!EventListener} */ (
      () => this.handleClick_());
  }

  init() {
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
  }

  /** @private */
  handleClick_() {
    this.adapter_.activateInputRipple();
    requestAnimationFrame(() => this.adapter_.deactivateInputRipple());
  }
}

export default MDCFormFieldFoundation;
