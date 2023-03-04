export class CoreCounter extends HTMLElement {
  cnt = 0

  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.addEventListener("user-input", this.handleUserInput.bind(this));
  }

  /**
   *
   * @param {CustomEvent} ev
   */
  handleUserInput(ev) {
    this.cnt = ev.detail.input.length;

    this.render();
  }

  /**
   * @todo Override this method
   */
  render() {
    this.innerHTML = ``;
  }

  connectedCallback() {
    this.render();
  }
}

export const TAG_NAME_NORMAL = 'ext-counter-normal';
export const TAG_NAME_POP = 'ext-counter-pop';
export const TAG_NAME_TEXT = 'ext-counter-text';