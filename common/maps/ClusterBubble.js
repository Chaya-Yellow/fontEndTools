// 腾讯地图【点聚合】重新定义点聚合的样式和交互

export default function ClusterBubble(options) {
    TMap.DOMOverlay.call(this, options);
  }
  
  ClusterBubble.prototype = new TMap.DOMOverlay();
  
  ClusterBubble.prototype.onInit = function (options) {
    this.content = options.content;
    this.position = options.position;
  };
  
  ClusterBubble.prototype.onDestroy = function () {
    this.dom.removeEventListener("click", this.onClick);
    this.removeAllListeners();
  };

  ClusterBubble.prototype.onClick = function () {
    this.emit("click");
  };
  
  ClusterBubble.prototype.createDOM = function () {
    const dom = document.createElement("div");
    dom.classList.add("clusterBubble");
    dom.innerText = this.content;
    dom.style.cssText = [
      "width: " + (40 + parseInt(this.content) * 2) + "px;",
      "height: " + (40 + parseInt(this.content) * 2) + "px;",
      "line-height: " + (40 + parseInt(this.content) * 2) + "px;",
    ].join(" ");
    this.onClick = this.onClick.bind(this);
    dom.addEventListener("click", this.onClick);
    return dom;
  };
  
  ClusterBubble.prototype.updateDOM = function () {
    if (!this.map) return;
    const pixel = this.map.projectToContainer(this.position);
    const left = pixel.getX() - this.dom.clientWidth / 2 + "px";
    const top = pixel.getY() - this.dom.clientHeight / 2 + "px";
    this.dom.style.transform = `translate(${left}, ${top})`;
    this.emit("dom_updated");
  };
  