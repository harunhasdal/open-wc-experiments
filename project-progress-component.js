import { LitElement, html, css } from "https://unpkg.com/lit-element?module";

class ProjectProgressComponent extends LitElement {
  static get properties() {
    return {
      current: { type: Number },
      fetchState: { type: String },
      projectId: { type: String },
      token: { type: String }
    };
  }

  static get styles() {
    return css`
      .stage {
        font-family: Arial, Helvetica, sans-serif;
      }
      .past {
        color: gray;
      }
      .current {
        color: blue;
      }
    `;
  }

  constructor() {
    super();
    this.current = 0;
    this.stages = [];
    this.fetchState = "Loading";
  }

  async fetchStages(projectId, token) {
    try {
      const response = await fetch(
        `https://app.fakejson.com/q/${projectId}?token=${token}`
      );
      const data = await response.json();
      this.stages = data.stages;
      this.fetchState = "Success";
    } catch (_) {
      this.fetchState = "Error";
    }
  }

  firstUpdated() {
    this.fetchStages(this.projectId, this.token);
  }

  handleNextClick() {
    if (this.current < this.stages.length - 1) {
      this.current += 1;
      let event = new CustomEvent("progress-changed", {
        detail: {
          value: this.stages[this.current],
          message: `Progress changed from ${this.stages[this.current - 1]} ${
            this.stages[this.current]
          }`
        }
      });
      this.dispatchEvent(event);
    }
  }

  handleBackClick() {
    if (this.current > 0) {
      this.current -= 1;
      let event = new CustomEvent("progress-changed", {
        detail: {
          value: this.stages[this.current],
          message: `Progress changed from ${this.stages[this.current + 1]} ${
            this.stages[this.current]
          }`
        }
      });
      this.dispatchEvent(event);
    }
  }

  render() {
    if (this.fetchState === "Loading") {
      return html`
        <p>Loading</p>
      `;
    }
    if (this.fetchState === "Error") {
      return html`
        <p>Loading failed</p>
      `;
    }
    return html`
      <ul>
        ${this.stages.map((s, i) => {
          let classes = i < this.current ? `stage past` : `stage`;
          classes = i == this.current ? `stage current` : classes;
          return html`
            <li class="${classes}">${s}</li>
          `;
        })}
      </ul>
      <button @click="${this.handleBackClick}">back</button>
      <button @click="${this.handleNextClick}">next</button>
    `;
  }
}

customElements.define("project-progress", ProjectProgressComponent);
