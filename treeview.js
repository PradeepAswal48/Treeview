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
 
  createNodes() {
    var JSONObject = this.data;
    for (var item in JSONObject) {
      if(this.objectType[item] && this.objectType[item]['type']===item){
        var obj={};
        obj[item]=JSONObject[item];
        this.leafNode.push(obj);
      }
      else if(JSONObject[item].hasOwnProperty('value')) {
        this.leafNode.push(JSONObject[item]);
      }
      else if (JSONObject[item]['type']['value'] && this.objectType[JSONObject[item]['type']['value']]['type']) {
        this.node.push(JSONObject[item]);
      }
    }

  }



  constructor() {
    super();
    this.node = [];
    this.leafNode = [];
    this.loadObjectTypes();


  }
  static get styles() {
    return css`
    :host {
      display: block;
      margin:0;
      padding:0;
    }`;
  }
  // connectedCallback() {
  //   super.connectedCallback();
  //   console.log('i load before render');
  //   this.innerText = 'loading';
  // }
  fetchData() {
    console.log("Data load for" + this.type);
    if (this.type === 'simulation') {
      var instance = this;
      var request = new XMLHttpRequest();
      request.open('GET', "./mockData/Process.json", false);
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          instance.data = JSON.parse(request.response);
        }
      }
      request.send();
    }
    else if (this.type === 'activity') {
      var instance = this;
      var request = new XMLHttpRequest();
      request.open('GET', "./mockData/activity.json", false);
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          instance.data = JSON.parse(request.response);
        }
      }
      request.send();
    }
    else if (this.type === 'executionOption') {
      var instance = this;
      var request = new XMLHttpRequest();
      request.open('GET', "./mockData/executionOption.json", false);
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          instance.data = JSON.parse(request.response);
        }
      }
      request.send();
      
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
        if(id && type){
          if (!this.parentElement.querySelector('#' + id)) {
            this.parentElement.querySelector(".nested").innerHTML += "<tree-view id=" + id + " type=" + type + "></tree-view>";
          }

        }
        
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("more-down");


      });
    }

  }
  renderProperties(propObject){
    var properties =[];
    for(var prop in propObject){
      properties.push(propObject[prop]);
    }
    return properties;

  }
  render() {
    this.fetchData();
    this.createNodes();
    return html`
      <link rel="stylesheet" href="./treeview-css.css">
      <ul id="myContent">
      ${this.leafNode.map(leafs => html`${leafs.hasOwnProperty('value')?
      html`
        <li class='li-content'><span class='default'>${leafs['value']}</span>
        <span>${leafs['type'] ? html`${leafs['type'] }`: html` ` }<span></li>
      `:
      html`<li><span class='more'>${Object.keys(leafs)[0]}</span>
                <ul class='nested'>
                    ${this.renderProperties(leafs['properties']).map(leaf => html`
                      <li class='li-content'><span class='default'>${leaf['value']}</span>
                      <span>${leaf['type'] ? html`${leaf['type']} `: html` ` }</span></li>
                    `)}
                </ul>
              </li>`}`)}

      
      ${this.node.map(nodes => html`<li>
              ${this.objectType[nodes['type']['value']]['preload'] ? html`
              <span data-id='${nodes['id']['value']}' data-type='${nodes['type']['value']}' class="more ">${nodes['name']['value']}</span><ul class='nested'>
              <tree-view id='${nodes.id}' type='${nodes.type}'></tree-view>
              </ul>  
              
              `: html`
              <span data-id='${nodes['id']['value']}' data-type='${nodes['type']['value']}' class="more ">${nodes['name']['value']}</span><ul class='nested'></ul></li>`}
              `)}
      

      </ul>
    `;
  }
}

customElements.define('tree-view', Treeview);
