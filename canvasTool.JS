//V 1.00  author:sparsh  time:2017/4/23
(function(){
//主类的构造函数，参数包括canvas DOM节点object，canvas对象 canvasobject，已绘制图形集合objArr
 function canvasTool(ele){
     this.object=ele;
     this.canvasobject=null;
     this.objArr={};
 };
//构建canvas对象，搭建canvas环境
 canvasTool.prototype.createDrawboard=function(){
     this.canvasobject=this.object.getContext("2d");
     this.canvasobject.save();
     return this;
 };
//把绘制的好的图形，存入this.objArr中，参数为存入对象名以及绘制好的图形的数据数组。
canvasTool.prototype.putObject=function(name,object){
    object.name=name;
this.objArr[name]=object;
};
//提取出图形的数据数组，参数需要图形名。

canvasTool.prototype.getObject=function(name){
    return this.objArr[name];
};
//给canvas图形对象注入自己的参数
canvasTool.prototype.selfAttr=function(name,pro,obj){
        var _obj=obj;
        _obj.selfAttr[name]=pro; 
        this.objArr[obj.name]=_obj;
        
}
canvasTool.prototype.getPoint=function(name){
       if(typeof name=="string"){
       return this.objArr[name][0].point;
       }
       else{
           return name[0].point;
       }
}
//移动指定canvas图形，参数为需要移动的图形数组，以及移动的距离distance，distance参数为数组，分别是[x移动距离，y移动距离]
canvasTool.prototype.moveObject=function(obj,distance){
        var _obj=obj
        var _data=null;
    for(var i=0;i<_obj.length;i++){
       if(typeof _obj[i]=="object"){   
           _data=_obj[i].point; 
       for(var j=0;j<_data.length;j++){
          if(_data[j] instanceof Array){             
          _data[j][0]+=distance[0];
          _data[j][1]+=distance[1];
           }
        else{
          _data[0]+= distance[0];
          _data[1]+=distance[1];
       }            
       }
               _obj[i].point=_data;          
     };
    } 
        this.objArr[obj.name]=_obj;
        this.reDraw(); 
};

//重绘画面，检查图形数组集合的每个数组，把每个数组重绘。来重绘另一个帧。
canvasTool.prototype.reDraw=function(){
    var _object=this.canvasobject;
    var _objArr=this.objArr;
    _object.clearRect(0,0,_object.canvas.width,_object.canvas.height);
  for(x in _objArr){
      var _nowarr=_objArr[x];
      var _length=_nowarr.length;
       var _newFunction=this[_nowarr[_length-1]];
     for(var i=0;i<_length-1;i++){
        _newFunction=_newFunction.bind(this,_nowarr[i]);
        if(i>=_length-2){
            _newFunction();
        };
     }
  }
};

 //绘制三角形，三个参数分别表示三角形三个点的坐标，参数都为数组。
canvasTool.prototype.drawPoint=function(arg){
    var _object=this.canvasobject;
    _object.beginPath();
    if(!!arg.color){
        _object.strokeStyle=arg.color;
    }
    else{
    };
    if(!!arg.lineWidth){
        _object.lineWidth=arg.lineWidth;
    }
    else{
    };
    arg.point.map(function(x,y){
        _object.lineTo(x[0],x[1]);
    });
    if(!!arg.close){
        _object.closePath();
    }
    else{
    };
    _object.stroke();
    var _return=[arg,"drawPoint"];
    _return.selfAttr={};
    return _return; 
};
//绘制矩形,指定矩形的左上角坐标，和高，宽，可选填入颜色。
canvasTool.prototype.drawRect=function(arg){
        var _object=this.canvasobject;
        _object.beginPath();
        if(arg.fill){
         if(!!arg.color==true){
          _object.fillStyle=arg.color;
        };
        _object.fillRect(arg.point[0],arg.point[1],arg.width,arg.height);           
        }
        else{
        if(!!arg.color==true){
          _object.strokeStyle=arg.color;
        };
        if(!!arg.lineWidth==true){
            _object.lineWidth=arg.lineWidth
        }
        _object.strokeRect(arg.point[0],arg.point[1],arg.width,arg.height);
        }
        var _return=[arg,"drawRect"];
          _return.selfAttr={};
        return _return;

};
canvasTool.prototype.getInitial=function(){
          this.canvasobject.restore();
          this.canvasobject.save();
};
canvasTool.prototype.transformScale=function(x,y,fn,arg){
var _object=this.canvasobject;
_object.save();
if(typeof fn=="function"){
_object.scale(x,y);
fn.bind(this)(arg);
_object.restore();
}
_object.scale(x,y);

};
canvasTool.prototype.transformRotate=function(argee,fn,arg){
var _object=this.canvasobject;
_object.save();
if(typeof fn=="function"){
_object.rotate(argee*Math.PI/180);    
fn.bind(this)(arg);
_object.restore();
}
_object.rotate(argee*Math.PI/180);

};
canvasTool.prototype.transformTranslate=function(x,y,fn,arg){
var _object=this.canvasobject;
_object.save();
if(typeof fn=="function"){
 _object.translate(x,y);
fn.bind(this)(arg);
_object.restore();
}
_object.translate(x,y);

};
canvasTool.prototype.transformObject=function(x1,x2, y1,y2,rx,ry,fn,arg){
var _object=this.canvasobject;
_object.save();
if(typeof fn=="function"){
_object.setTransform(x1,x2,y1,y2,rx,ry);
fn.bind(this)(arg);
_object.restore();
}
_object.setTransform(x1,x2,y1,y2,rx,ry);
};
canvasTool.prototype.transformObject=
//放入图像，canvas图形，图片，等
canvasTool.prototype.putImage=function(src,point,width,height){
    var _object=this.canvasobject;
 var _imgObject=new Image();
 _imgObject.src=src;
 _imgObject.onload=function(){
 _object.drawImage(_imgObject,point[0],point[1],width,height);
 };
         _object.fillRect(point[0],point[1],width,height);
        var returnArr=[src,point,width,height,"putImage"];
          returnArr.selfAttr={};
        return returnArr;
};
//滤镜方法
canvasTool.prototype.putFilter=function(x,y,width,height,target,type){
    var _object=this.canvasobject;
    var _imgObject=_object.getImageData(x,y,width,height);
    var _imgDate=_imgObject.data;
    var _tempImgDate=_object.getImageData(x,y,width,height).data;
   switch(type)
   {
    case "blur":
    for(var i=3;i<height-3;i++){
        for(var j=3;j<width-3;j++){
            var totalr=0,totalg=0,totalb=0;
            for(var dx=-3;dx<=3;dx++){
                for(var dy=-3;dy<=3;dy++){
                    var x=i+dx;
                    var y=j+dy;
                    var p=x*width+y;
                    totalr+=_tempImgDate[p*4+0];
                    totalg+=_tempImgDate[p*4+1];
                    totalb+=_tempImgDate[p*4+2];
                }
                var p=i*width+j;
                _imgDate[p*4+0]=totalr/49;
                _imgDate[p*4+1]=totalg/49;
                _imgDate[p*4+2]=totalb/49;
            }
        }
    }
    break;
    case "Mosaic":
    break;
    default:
        for(var i=0;i<width*height;i++){   
        switch(type)
        {
         case "grey":
          
        var _r=_imgDate[4*i+0]*0.3;
        var _g=_imgDate[4*i+1]*0.59;
        var _b=_imgDate[4*i+2]*0.11;
        var grey=_r+_g+_b;
        _imgDate[4*i+0]=grey;
        _imgDate[4*i+1]=grey;
        _imgDate[4*i+2]=grey;
        break;
        case "black":
        var _r=_imgDate[4*i+0]*0.3;
        var _g=_imgDate[4*i+1]*0.59;
        var _b=_imgDate[4*i+2]*0.11;
        var v=255;
        var grey=_r+_g+_b;
        if(grey>255/2){
            v=255;
        }
        else{
            v=0
        }
        _imgDate[4*i+0]=v;
        _imgDate[4*i+1]=v;
        _imgDate[4*i+2]=v;
          break;
        case "reverse":
        var _r=_imgDate[4*i+0];
        var _g=_imgDate[4*i+1];
        var _b=_imgDate[4*i+2];
        _imgDate[4*i+0]=255-_r;
        _imgDate[4*i+1]=255-_g;
        _imgDate[4*i+2]=255-_b;
          break;
        case "removeRed":
        var _r=0;
        var _g=_imgDate[4*i+1];
        var _b=_imgDate[4*i+2];
        _imgDate[4*i+0]=_r;
        _imgDate[4*i+1]=_g;
        _imgDate[4*i+2]=_b;    
        break;    
        case "removeGreen":
        var _r=_imgDate[4*i+0];
        var _g=0;
        var _b=_imgDate[4*i+2];
        _imgDate[4*i+0]=_r;
        _imgDate[4*i+1]=_g;
        _imgDate[4*i+2]=_b;    
        break;  
         case "removeBlack":
        var _r=_imgDate[4*i+0];
        var _g=_imgDate[4*i+1];
        var _b=0;
        _imgDate[4*i+0]=_r;
        _imgDate[4*i+1]=_g;
        _imgDate[4*i+2]=_b;    
        break;                   
        };
      
    };
      break;
   };

    target.canvasobject.putImageData(_imgObject,0,0);
};

//对外接口。对外直接$c(canvas节点),就能获取到通过特殊包装拥有封装的所有方法的canvas对象。
window.$c=function(ele){
    return new canvasTool(ele).createDrawboard();
}
})();
