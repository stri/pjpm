/**
 * 判断一个结点是否在可见区域中
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 12:01:04
 * @version 0.1
 */
define(function(module){
  /** 
   * 判断节点是否在可视区域中
   * @param target {String} 目标结点
   * @param threshold {Number} 敏感值，默认为0
   */
  function inVisibleArea(target,threshold){
    var node,
        box,
        isLastNode,
        threshold = threshold || 0,
        offsetParent,
        xStatus = false,
        yStatus = false,
        winNode,
        winHeight,
        winWidth,
        winNodeX,
        winNodeY, // 窗口的纵坐标
        nodeOffset,
        winThresholdY,
        winThresholdX,
        isHide = false,
        nodeX,
        nodeY; // 区域节点的纵坐标

    node = $(target);
    nodeOffset = node.offset();
    nodeX = nodeOffset.left;
    nodeY = nodeOffset.top;
    isHide = (node.css('display') == 'none') || (nodeY == 0 && nodeX == 0);
    nodeY = !isHide && (nodeY - threshold);
    offsetParent = node.offsetParent();
    isLastNode = offsetParent[0] == (document.documentElement || document.body);

    // 如果隐藏，则返回false
    if(isHide){
      return false;
    }


    try{
      // 如果是根结点，则看scrollLeft
      if(isLastNode){
        winNode = $(window);
        winNodeX = winNode.scrollLeft();
        winNodeY= winNode.scrollTop();
        winHeight = winNode.height();
        winWidth = winNode.width();
      }else{
        winNodeX = offsetParent.offset().left;
        winNodeY = offsetParent.offset().top;
        winHeight = offsetParent.innerHeight();
        winWidth = offsetParent.innerWidth();
      }

      winThresholdX = winNodeX + winWidth;// - (threshold || 0);
      winThresholdY = winNodeY+ winHeight;

      // 如果容器的高度+top偏移值 大于 目标节点的top偏移值时
      if(nodeY <= winThresholdY){
        yStatus = true;
      }

      // 如果容器的宽度+ left偏移值 大于目标节点的left偏移值时
      if(nodeX <= winThresholdX){
        xStatus = true;
      }
    }catch(e){
    	isLastNode = false;
      yStatus = true;
      xStatus = true;
    }

    return xStatus && yStatus && ( isLastNode ? true : inVisibleArea(offsetParent,threshold));
  }

  module.exports = inVisibleArea;
});

