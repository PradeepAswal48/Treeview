import { LitElement, css } from 'lit-element/lit-element.js';
import { html } from 'lit-html/lit-html'
class Treeview extends LitElement {
  static get properties() {
    return {
      type: {
        type: String
      },
      id: {
        type: String
      },
      objectType: {
        type: Object
      },
      data: {
        type: Object
      },
      node: {
        type: Array
      },
      leafNode: {
        type: Array
      }

    };

  }
  hasProperty(item) {
    if (this.objectType[item]) {
      return true;
    }
    return false;
  }
  parseJSONtoHTML() {
    var JSONObject = this.data;
    for (var item in JSONObject) {
      if (this.hasProperty(item)) {
        this.node.push(JSONObject[item]);
      }
      else {
        this.leafNode.push(JSONObject[item]);
      }
    }

  }



  constructor() {
    super();
    this.node = [];
    this.leafNode = [];
    this.loadObjectTypes();


  }
  connectedCallback() {
    super.connectedCallback();
    console.log('i load before render');
    this.innerText = 'loading';
  }
  fetchData() {
    console.log("Data load for" + this.type);
    if (this.type === 'simulation') {
      this.data = {
        'name': 'simulation1',
        'type': 'simulation',
        'activity': {
          'name': 'Activty Name',
          'id': 'act-123',
          'type': 'activity'
        }
      };

    }
    else if (this.type === 'activity') {
      this.data = {
        'name': 'Act1',
        'executionOption': {
          'name': 'Execution Option', 'type': 'executionOption',
          'id': 'exe-123'
        }
      };
    }

  }
  loadObjectTypes() {
    var instance = this;
    var request = new XMLHttpRequest();
    request.open('GET', "./treeDefination.json", false);
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        instance.objectType = JSON.parse(request.response);
      }
    }
    request.send();
  }

  firstUpdated(changedProperties) {
    var toggler = this.renderRoot.querySelectorAll('.more');
    var i;
    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        var id = this.getAttribute('data-id');
        var type = this.getAttribute('data-type');
        if (!this.parentElement.querySelector('#' + id)) {
          this.parentElement.querySelector(".nested").innerHTML += "<tree-view id=" + id + " type=" + type + "></tree-view>";
        }
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("more-down");


      });
    }

  }
  render() {
    this.fetchData();
    this.parseJSONtoHTML();
    return html`
    <link rel="stylesheet" href="./treeview-css.css">
    
    <ul id="myContent">
    ${this.leafNode.map(leafnodes => html`<li>${leafnodes}</li>`)}
    ${this.node.map(nodes => html`<li>
    ${this.objectType[nodes.type]['preload'] ? html`
    <span data-id='${nodes.id}' data-type='${nodes.type}' class="more">${nodes.name}</span><ul class='nested'>
    <tree-view id='${nodes.id}' type='${nodes.type}'></tree-view>
    </ul>  
    
    `: html`
    <span data-id='${nodes.id}' data-type='${nodes.type}' class="more">${nodes.name}</span><ul class='nested'></ul></li>`}
    `)}
  </ul>
    
    `;
  }
}

customElements.define('tree-view', Treeview);
