import { LitElement, css } from 'lit-element/lit-element.js';
import { html } from 'lit-html/lit-html'
class Treeview extends LitElement {
  static get properties(){
    return{
      objectType :{
        type:Array
      },
      data : {
        type : Object
      },
      node :{
        type : Array
      },
      leafNode:{
        type:Array
      }

    };

  }
  hasProperty(item){
    if(this.objectType.indexOf(item)>0){
      return true;
    }
    return false;
  }
  parseJSONtoHTML(JSONObject){
    
    for( var item in JSONObject){
      if(this.hasProperty(item)){
        this.node.push(JSONObject[item]);
      }
      else{
        this.leafNode.push(JSONObject[item]);
      }
    }
    
  }



  constructor() {
    super();
    this.node = [];
    this.leafNode = [];
    this.objectType = ['Simulation', 'Activities'];

  }
  firstUpdated(changedProperties) {
    var toggler = this.renderRoot.querySelectorAll('.more');
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("more-down");
      });
    }

  }
  render() {
    let temp = {'attribute6':'value6','Activities':'will have more'};
    this.parseJSONtoHTML(temp);
    return html`
    <link rel="stylesheet" href="./treeview.css">
    <div class="processTree">
    <span>Process Browser</span>
    <div>
    <ul id="myContent">
    
    ${this.node.map(nodes => html`<li>
    <span class="more">${nodes}<span></li>
    `)}
    
    ${this.leafNode.map(leafnodes => html`<li>${leafnodes}</li>`)}
  </ul>
    </div>
    </div>
    
    `;
  }
}

customElements.define('tree-view', Treeview);
