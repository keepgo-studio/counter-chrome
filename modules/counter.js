"use strict";

import {
  CoreCounter,
  TAG_NAME_TEXT,
  TAG_NAME_NORMAL,
  TAG_NAME_POP,
} from "./core.js";

const coreStyle = `
  .main-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    z-index: 0;
    font-family: Verdana, sans-serif;
  }
`;

class CounterNormal extends CoreCounter {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${coreStyle}

        .main-container {
          display: flex;
          justify-content: right;
          align-items: center;
          font-size: inherit;
          z-index: 10;
        }

        .main-container > div {
          width: 1.8em;
          height: 1.8em;
          border-radius: 50%;
          background-color: rgba(14,14,14,0.5);
          position: relative;
          color: white;
        }
        .main-container > div > span {
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%, -50%);
        }
      </style>

      <section class="main-container">
        <div>
          <span>${this.cnt}</span>
        </div>
      </section>
    `;
  }
}

class CounterPop extends CoreCounter {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${coreStyle}

        .main-container {
          position: absolute;
          top:0;
          left:0;
          padding: .1em .3em;
          width: fit-content;
          min-width: 3em;
          height: fit-content;
          text-align: center;
          background-color: #DB4F40;
          transform: translateY(-100%);
          border-radius: .8em .8em 0 0;
          color: white;
        }
      </style>

      <section class="main-container">
        <div>${this.cnt}</div>
      </section>
    `;
  }
}

class CounterText extends CoreCounter {
  render() {
    const text = chrome.i18n.getMessage("count");

    this.shadowRoot.innerHTML = `
      <style>
        ${coreStyle}

        .main-container {
          position: relative;
          mix-blend-mode: revert;
          z-index: 999;
        }
        .main-container > div{
          position: absolute;
          top:-.2em;
          left:0;
          transform: translateY(-100%);
        }
      </style>
      
      <section class="main-container">
        <div>[${text}: ${this.cnt}]</div>
      </section>
    `;
  }
}

export class App {
  allInputs = [];
  tagName = TAG_NAME_NORMAL;

  static setTags() {
    customElements.define(TAG_NAME_NORMAL, CounterNormal);
    customElements.define(TAG_NAME_POP, CounterPop);
    customElements.define(TAG_NAME_TEXT, CounterText);
  }

  constructor(allInputs, theme = "normal") {
    this.allInputs = allInputs;

    this.init(theme);
  }

  init(theme) {
    this.update(theme);
    this.attachEvent();
  }

  sendValue(elem, value) {
    elem.dispatchEvent(
      new CustomEvent("user-input", {
        detail: {
          input: value,
        },
      })
    );
  }

  fireEvent(inputElem) {
    const counterElem = inputElem.parentElement.querySelector(this.tagName);

    if (counterElem) {
      const comp = getComputedStyle(inputElem);
      let padding = parseInt(comp.paddingRight.replace(/px/, ""));

      // search type input tag has native close button on the right side
      if (inputElem.type === "search") {
        padding += 20;
      }

      // some website has dynamic width, height for input element
      counterElem.style.width = inputElem.offsetWidth - padding * 2 + "px";
      if (this.tagName === TAG_NAME_NORMAL) {
        counterElem.style.height = inputElem.offsetHeight + "px";
        counterElem.style.left = inputElem.offsetLeft + padding + "px";
      }

      counterElem.style.fontSize =
        parseInt(parseInt(comp.fontSize.replace(/px/, "")) * 0.85) + "px";

      this.sendValue(counterElem, inputElem.value);
    }
  }

  attachEvent() {
    this.allInputs.forEach((inputElem) => {
      inputElem.addEventListener("keyup", () => this.fireEvent(inputElem));

      inputElem.addEventListener("input", () => this.fireEvent(inputElem));
    });
  }

  update(theme) {
    const prevTheme = this.tagName;

    switch (theme) {
      case "normal":
        this.tagName = TAG_NAME_NORMAL;
        break;
      case "pop":
        this.tagName = TAG_NAME_POP;
        break;
      case "text":
        this.tagName = TAG_NAME_TEXT;
        break;
    }

    this.render(prevTheme);
  }

  render(prevTheme) {
    this.allInputs.forEach((inputElem) => {
      if (
        inputElem.type === "text" ||
        inputElem.type === "password" ||
        inputElem.type === "number" ||
        inputElem.type === "search" ||
        inputElem.type === "email"
      ) {
        const parentElem = inputElem.parentElement;

        if (parentElem.querySelector(prevTheme)) {
          parentElem.querySelector(prevTheme).remove();
        }

        if (!parentElem.querySelector(this.tagName)) {
          const CE = document.createElement(this.tagName);

          parentElem.appendChild(CE);

          parentElem.style.position = "relative";
          CE.style.position = "absolute";
          if (this.tagName === TAG_NAME_NORMAL) {
            CE.style.top = inputElem.offsetTop + "px";
            CE.style.left = inputElem.offsetLeft + "px";
          } else {
            CE.style.top = "0";
            CE.style.left = "0";
            CE.style.height = "100%";
          }
          CE.style.display = "inline-block";
          CE.style.pointerEvents = "none";

          this.fireEvent(inputElem);
        }
      }
    });
  }

  remove() {
    document.body
      .querySelectorAll(this.tagName)
      .forEach((elem) => elem.remove());
  }
}
