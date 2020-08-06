
import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-myrtc',
  templateUrl: './myrtc.component.html',
  styleUrls: ['./myrtc.component.less']
})
export class MyrtcComponent implements OnInit {

  //constructor() { }

  ngOnInit() {
  }
  constructor(private cdr:ChangeDetectorRef) { }


  /*
 activeBox = -1;  // nothing selected
 aspectRatio = 4/3;  // standard definition video aspect ratio
 maxCALLERS = 3;
 numVideoOBJS = 3+1;
 layout;


//easyrtc.dontAddCloseButtons();
   getIdOfBox(boxNum) {
    return "box" + boxNum;
}
  reshapeFull(parentw, parenth) {
    return {
        left:0,
        top:0,
        width:parentw,
        height:parenth
    };
}

  reshapeTextEntryBox(parentw, parenth) {
    return {
        left:parentw/4,
        top:parenth/4,
        width:parentw/2,
        height: parenth/4
    }
}

  reshapeTextEntryField(parentw, parenth) {
    return {
        width:parentw -40
    }
}

 margin = 20;

  reshapeToFullSize(parentw, parenth) {
    var left, top, width, height;
    var margin= 20;

    if( parentw < parenth*this.aspectRatio){
        width = parentw -margin;
        height = width/this.aspectRatio;
    }
    else {
        height = parenth-margin;
        width = height*this.aspectRatio;
    }
    left = (parentw - width)/2;
    top = (parenth - height)/2;
    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}

//
// a negative percentLeft is interpreted as setting the right edge of the object
// that distance from the right edge of the parent.
// Similar for percentTop.
//
  setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

    var width, height;
    if( parentw < parenth*this.aspectRatio){
        width = parentw * percentSize;
        height = width/aspect;
    }
    else {
        height = parenth * percentSize;
        width = height*aspect;
    }
    var left;
    if( percentLeft < 0) {
        left = parentw - width;
    }
    else {
        left = 0;
    }
    left += Math.floor(percentLeft*parentw);
    var top = 0;
    if( percentTop < 0) {
        top = parenth - height;
    }
    else {
        top = 0;
    }
    top += Math.floor(percentTop*parenth);
    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}


  setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
    return this.setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, this.aspectRatio);
}

  setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
    return this.setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
}


 sharedVideoWidth  = 1;
 sharedVideoHeight = 1;

  reshape1of2(parentw, parenth) {
    if( this.layout== 'p' ) {
        return {
            left: (parentw-this.sharedVideoWidth)/2,
            top:  (parenth -this.sharedVideoWidth*2)/3,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        };
    }
    else {
        return{
            left: (parentw-this.sharedVideoWidth*2)/3,
            top:  (parenth -this.sharedVideoWidth)/2,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        }
    }
}



  reshape2of2(parentw, parenth){
    if( this.layout== 'p' ) {
        return {
            left: (parentw-this.sharedVideoWidth)/2,
            top:  (parenth -this.sharedVideoWidth*2)/3 *2 + this.sharedVideoWidth,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        };
    }
    else {
        return{
            left: (parentw-this.sharedVideoWidth*2)/3 *2 + this.sharedVideoWidth,
            top:  (parenth -this.sharedVideoWidth)/2,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        }
    }
}

  reshape1of3(parentw, parenth) {
    if( this.layout== 'p' ) {
        return {
            left: (parentw-this.sharedVideoWidth)/2,
            top:  (parenth -this.sharedVideoWidth*3)/4 ,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        };
    }
    else {
        return{
            left: (parentw-this.sharedVideoWidth*2)/3,
            top:  (parenth -this.sharedVideoWidth*2)/3,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        }
    }
}

  reshape2of3(parentw, parenth){
    if( this.layout== 'p' ) {
        return {
            left: (parentw-this.sharedVideoWidth)/2,
            top:  (parenth -this.sharedVideoWidth*3)/4*2+ this.sharedVideoWidth,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        };
    }
    else {
        return{
            left: (parentw-this.sharedVideoWidth*2)/3*2+this.sharedVideoWidth,
            top:  (parenth -this.sharedVideoWidth*2)/3,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        }
    }
}

  reshape3of3(parentw, parenth) {
    if( this.layout== 'p' ) {
        return {
            left: (parentw-this.sharedVideoWidth)/2,
            top:  (parenth -this.sharedVideoWidth*3)/4*3+ this.sharedVideoWidth*2,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        };
    }
    else {
        return{
            left: (parentw-this.sharedVideoWidth*2)/3*1.5+this.sharedVideoWidth/2,
            top:  (parenth -this.sharedVideoWidth*2)/3*2+ this.sharedVideoWidth,
            width: this.sharedVideoWidth,
            height: this.sharedVideoWidth
        }
    }
}


  reshape1of4(parentw, parenth) {
    return {
        left: (parentw - this.sharedVideoWidth*2)/3,
        top: (parenth - this.sharedVideoWidth*2)/3,
        width: this.sharedVideoWidth,
        height: this.sharedVideoWidth
    }
}

  reshape2of4(parentw, parenth) {
    return {
        left: (parentw - this.sharedVideoWidth*2)/3*2+ this.sharedVideoWidth,
        top: (parenth - this.sharedVideoWidth*2)/3,
        width: this.sharedVideoWidth,
        height: this.sharedVideoWidth
    }
}
  reshape3of4(parentw, parenth) {
    return {
        left: (parentw - this.sharedVideoWidth*2)/3,
        top: (parenth - this.sharedVideoWidth*2)/3*2 + this.sharedVideoWidth,
        width: this.sharedVideoWidth,
        height: this.sharedVideoWidth
    }
}

  reshape4of4(parentw, parenth) {
    return {
        left: (parentw - this.sharedVideoWidth*2)/3*2 + this.sharedVideoWidth,
        top: (parenth - this.sharedVideoWidth*2)/3*2 + this.sharedVideoWidth,
        width: this.sharedVideoWidth,
        height: this.sharedVideoWidth
    }
}

 boxUsed = [true, false, false, false];
 connectCount = 0;


  setSharedVideoSize(parentw, parenth) {
    this.layout = ((parentw /this.aspectRatio) < parenth)?'p':'l';
    var w, h;

     function sizeBy(fullsize, numVideos) {
        return (fullsize - this.margin*(numVideos+1) )/numVideos;
    }

    switch(this.layout+(this.connectCount+1)) {
        case 'p1':
        case 'l1':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 1);
            break;
        case 'l2':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 1);
            break;
        case 'p2':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 2);
            break;
        case 'p4':
        case 'l4':
        case 'l3':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 2);
            break;
        case 'p3':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 3);
            break;
    }
    this.sharedVideoWidth = Math.min(w, h * this.aspectRatio);
    this.sharedVideoWidth = Math.min(h, w/this.aspectRatio);
}

 reshapeThumbs = [
     function(parentw, parenth) {

        if( this.activeBox > 0 ) {
            return this.setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
        }
        else {
            this.setSharedVideoSize(parentw, parenth)
            switch(this.connectCount) {
                case 0:return this.reshapeToFullSize(parentw, parenth);
                case 1:return this.reshape1of2(parentw, parenth);
                case 2:return this.reshape1of3(parentw, parenth);
                case 3:return this.reshape1of4(parentw, parenth);
            }
        }
    },
     function(parentw, parenth) {
        if( this.activeBox >= 0 || !this.boxUsed[1]) {
            return this.setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
        }
        else{
            switch(this.connectCount) {
                case 1:
                    return this.reshape2of2(parentw, parenth);
                case 2:
                    return this.reshape2of3(parentw, parenth);
                case 3:
                    return this.reshape2of4(parentw, parenth);
            }
        }
    },
     function(parentw, parenth) {
        if( this.activeBox >= 0 || !this.boxUsed[2] ) {
            return this.setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
        }
        else  {
            switch(this.connectCount){
                case 1:
                    return this.reshape2of2(parentw, parenth);
                case 2:
                    if( !this.boxUsed[1]) {
                        return this.reshape2of3(parentw, parenth);
                    }
                    else {
                        return this.reshape3of3(parentw, parenth);
                    }
               
                case 3:
                    return this.reshape3of4(parentw, parenth);
            }
        }
    },
     function(parentw, parenth) {
        if( this.activeBox >= 0 || !this.boxUsed[3]) {
            return this.setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
        }
        else{
            switch(this.connectCount){
                case 1:
                    return this.reshape2of2(parentw, parenth);
                case 2:
                    return this.reshape3of3(parentw, parenth);
                case 3:
                    return this.reshape4of4(parentw, parenth);
            }
        }
    },
];


  killButtonReshaper(parentw, parenth) {
    var imagew = 128;
    var imageh = 128;
    if( parentw < parenth) {
        return this.setThumbSizeButton(0.1, -0.51, -0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return this.setThumbSizeButton(0.1, -0.01, -0.51, parentw, parenth, imagew, imageh);
    }
}


  muteButtonReshaper(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return this.setThumbSizeButton(0.10, -0.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return this.setThumbSizeButton(0.10, 0.01, -0.51, parentw, parenth, imagew, imageh);
    }
}

  reshapeTextEntryButton(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return this.setThumbSizeButton(0.10, 0.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return this.setThumbSizeButton(0.10, 0.01, 0.51, parentw, parenth, imagew, imageh);
    }
}


  handleWindowResize() {
    var fullpage = document.getElementById('fullpage');
    fullpage.style.width = window.innerWidth + "px";
    fullpage.style.height = window.innerHeight + "px";
    this.connectCount = easyrtc.getConnectionCount();

     function applyReshape(obj,  parentw, parenth) {
        var myReshape = obj.reshapeMe(parentw, parenth);

        if(typeof myReshape.left !== 'undefined' ) {
            obj.style.left = Math.round(myReshape.left) + "px";
        }
        if(typeof myReshape.top !== 'undefined' ) {
            obj.style.top = Math.round(myReshape.top) + "px";
        }
        if(typeof myReshape.width !== 'undefined' ) {
            obj.style.width = Math.round(myReshape.width) + "px";
        }
        if(typeof myReshape.height !== 'undefined' ) {
            obj.style.height = Math.round(myReshape.height) + "px";
        }

        var n = obj.childNodes.length;
        for(var i = 0; i < n; i++ ) {
            var childNode = obj.childNodes[i];
            if( childNode.reshapeMe) {
                applyReshape(childNode, myReshape.width, myReshape.height);
            }
        }
    }

    applyReshape(fullpage, window.innerWidth, window.innerHeight);
}


  setReshaper(elementId, reshapeFn) {
    var element = document.getElementById(elementId);
    if( !element) {
        alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
    }
    if( !reshapeFn) {
        alert("Attempt to apply misnamed reshapeFn to element " + elementId);
    }
  //jimmy comment  element.reshapeMe = reshapeFn;
}


  collapseToThumbHelper() {
    if( this.activeBox >= 0) {
        var id = this.getIdOfBox(this.activeBox);
        //jimmy comments 
        //document.getElementById(id).style.zIndex = 2;
        this.setReshaper(id, this.reshapeThumbs[this.activeBox]);
        document.getElementById('muteButton').style.display = "none";
        document.getElementById('killButton').style.display = "none";
        this.activeBox = -1;
    }
}

  collapseToThumb() {
    this.collapseToThumbHelper();
    this.activeBox = -1;
    this.updateMuteImage(false);
    this.handleWindowResize();

}

  updateMuteImage(toggle) {
    var muteButton = document.getElementById('muteButton');
    if( this.activeBox > 0) { // no kill button for self video
        muteButton.style.display = "block";
        var videoObject = document.getElementById( this.getIdOfBox(this.activeBox));
        //jimmy comment
       // var isMuted = videoObject.muted?true:false;
       // if( toggle) {
      //      isMuted = !isMuted;
          //  videoObject.muted = isMuted;
      //  }
     //   muteButton.src = isMuted?"images/button_unmute.png":"images/button_mute.png";
    }
    else {
        muteButton.style.display = "none";
    }
}


  expandThumb(whichBox) {
    var lastActiveBox = this.activeBox;
    if( this.activeBox >= 0 ) {
      this.collapseToThumbHelper();
    }
    if( lastActiveBox != whichBox) {
        var id =this.getIdOfBox(whichBox);
        this.activeBox = whichBox;
        this.setReshaper(id, this.reshapeToFullSize);
        //jimmy comment 
        //document.getElementById(id).style.zIndex = 1;
        if( whichBox > 0) {
            document.getElementById('muteButton').style.display = "block";
            this.updateMuteImage(false);
            document.getElementById('killButton').style.display = "block";
        }
    }
    this.updateMuteImage(false);
    this.handleWindowResize();
}

prepVideoBox(whichBox) {
    var id = this.getIdOfBox(whichBox);
    this.setReshaper(id, this.reshapeThumbs[whichBox]);
 //   document.getElementById(id).onclick =  function() {
 //     expandThumb(whichBox);
 //   };
}


  killActiveBox() {
    if( this.activeBox > 0) {
        var easyrtcid = easyrtc.getIthCaller(this.activeBox-1);
        this.collapseToThumb();
        setTimeout(  function() {
            easyrtc.hangup(easyrtcid);
        }, 400);
    }
}


  muteActiveBox() {
    this.updateMuteImage(true);
}




  callEverybodyElse(roomName, otherPeople) {

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
     function establishConnection(position) {
         function callSuccess() {
            connectCount++;
            if( connectCount < this.maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
         function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < this.maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure,function(wasAccepted, easyrtcid){
                     if( wasAccepted ){
                        console.log("call accepted by " + easyrtc.idToName(easyrtcid));
                     }
                    else{
                          console.log("call rejected" + easyrtc.idToName(easyrtcid));
                    }
                },["forwardedStream"]);

    }
    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}


  loginSuccess() {
    this.expandThumb(0);  // expand the mirror image initially.
}


  cancelText() {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
}


  sendText(e) {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
    var stringToSend ="test";// document.getElementById('textentryField').value;
    if( stringToSend && stringToSend != "") {
        for(var i = 0; i < this.maxCALLERS; i++ ) {
            var easyrtcid = easyrtc.getIthCaller(i);
            if( easyrtcid && easyrtcid != "") {
                easyrtc.sendPeerMessage(easyrtcid, "im",  stringToSend, function(msgType, msgBody ){
                               console.log("message was sent");
                              },
                              function(errorCode, errorText){
                                 console.log("error was " + errorText);
                          }
                          );
            }
        }
    }
    return false;
}


  showTextEntry() {
    //document.getElementById('textentryField').value = "";
    document.getElementById('textentryBox').style.display = "block";
    document.getElementById('textEntryButton').style.display = "none";
    document.getElementById('textentryField').focus();
}


  showMessage(startX, startY, content) {
    //jimmy comments
  //  var fullPage = document.getElementById('fullpage');
 //   var fullW = parseInt(fullPage.offsetWidth);
 //   var fullH = parseInt(fullPage.offsetHeight);
 //   var centerEndX = 0.2*startX + 0.8*fullW/2;
 //   var centerEndY = 0.2*startY + 0.8*fullH/2;
   var fullW = parseInt("800");
    var fullH = parseInt("600");
    var centerEndX = 0.2*startX + 0.8*fullW/2;
    var centerEndY = 0.2*startY + 0.8*fullH/2;


    var cloudObject = document.createElement("img");
    cloudObject.src = "images/cloud.png";
    cloudObject.style.width = "1px";
    cloudObject.style.height = "1px";
    cloudObject.style.left = startX + "px";
    cloudObject.style.top = startY + "px";
    document.getElementById('fullpage').appendChild(cloudObject);

    cloudObject.onload =  function() {
        cloudObject.style.left = startX + "px";
        cloudObject.style.top = startY + "px";
        cloudObject.style.width = "4px";
        cloudObject.style.height = "4px";
      //jimmy  cloudObject.style.opacity = 0.7;
     //jimmy   cloudObject.style.zIndex = 5;
        cloudObject.className = "transit boxCommon";
        var textObject;
         function removeCloud() {
            if( textObject) {
              document.getElementById('fullpage').removeChild(textObject);
              document.getElementById('fullpage').removeChild(cloudObject);
            }
        }
        setTimeout( function() {
            cloudObject.style.left = centerEndX - fullW/4 + "px";
            cloudObject.style.top = centerEndY - fullH/4+ "px";
            cloudObject.style.width = (fullW/2) + "px";
            cloudObject.style.height = (fullH/2) + "px";
        }, 10);
        setTimeout( function() {
            textObject = document.createElement('div');
            textObject.className = "boxCommon";
            textObject.style.left = Math.floor(centerEndX-fullW/8) + "px";
            textObject.style.top = Math.floor(centerEndY) + "px";
            textObject.style.fontSize = "36pt";
            textObject.style.width = (fullW*0.4) + "px";
            textObject.style.height = (fullH*0.4) + "px";
            textObject.style.zIndex = 6;
            textObject.appendChild( document.createTextNode(content));
            document.getElementById('fullpage').appendChild(textObject);
            textObject.onclick = removeCloud;
            cloudObject.onclick = removeCloud;
        }, 1000);
        setTimeout( function() {
            cloudObject.style.left = startX + "px";
            cloudObject.style.top = startY + "px";
            cloudObject.style.width = "4px";
            cloudObject.style.height = "4px";
            document.getElementById('fullpage').removeChild(textObject);
        }, 9000);
        setTimeout( function(){
          document.getElementById('fullpage').removeChild(cloudObject);
        }, 10000);
    }
}

  messageListener(easyrtcid, msgType, content) {
    for(var i = 0; i < this.maxCALLERS; i++) {
        if( easyrtc.getIthCaller(i) == easyrtcid) {
            var startArea = document.getElementById(this.getIdOfBox(i+1));
            //jimmy comnet
            //var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
            //var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;

          //  var startX = parseInt("800") + parseInt("600")/2;
          //  var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;
          //  this.showMessage(startX, startY, content);
        }
    }
}


  appInit() {

    // Prep for the top-down this.layout manager
    this.setReshaper('fullpage', this.reshapeFull);
    for(var i = 0; i < this.numVideoOBJS; i++) {
      this.prepVideoBox(i);
    }
    this.setReshaper('killButton', this.killButtonReshaper);
    this.setReshaper('muteButton', this.muteButtonReshaper);
    this.setReshaper('textentryBox', this.reshapeTextEntryBox);
    this.setReshaper('textentryField', this.reshapeTextEntryField);
    this.setReshaper('textEntryButton', this.reshapeTextEntryButton);

    this.updateMuteImage(false);
    window.onresize = this.handleWindowResize;
    this.handleWindowResize(); //initial call of the top-down this.layout manager


    easyrtc.setRoomOccupantListener(this.callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], this.loginSuccess,
                   function(errorCode, errorText){
                     console.log(errorText);
                    });
    easyrtc.setPeerListener(this.messageListener);
    easyrtc.setDisconnectListener(  function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
	var box0=document.getElementById('box0');
	var canvas0=document.getElementById('canvas0');
	//bindPage(box0,canvas0);
    easyrtc.setOnCall(  function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        this.boxUsed[slot+1] = true;
        if(this.activeBox == 0 ) { // first connection
          this.collapseToThumb();
            document.getElementById('textEntryButton').style.display = 'block';
        }
        document.getElementById(this.getIdOfBox(slot+1)).style.visibility = "visible";
		
        this.handleWindowResize();
    });


    easyrtc.setOnHangup( function(easyrtcid, slot) {
      this.boxUsed[slot+1] = false;
        if(this.activeBox > 0 && slot+1 == this.activeBox) {
          this.collapseToThumb();
        }
        setTimeout( function() {
            document.getElementById(this.getIdOfBox(slot+1)).style.visibility = "hidden";

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
              this.expandThumb(0);
                document.getElementById('textEntryButton').style.display = 'none';
                document.getElementById('textentryBox').style.display = 'none';
            }
            this.handleWindowResize();
        },20);
    });
}

*/

  /*

  myId:string = '';
  connectedClientsList:Array<string> = [];

  clearConnectList():void {
    this.connectedClientsList = [];
    this.cdr.detectChanges();
  }
  
  performCall(clientEasyrtcId:string):void {
    let successCB = function(a:string, b:string):void {};
    let failureCB = function(a:string, b:string):void {};
    easyrtc.call(clientEasyrtcId, successCB, failureCB, undefined, undefined);
  }

  buildCaller(easyrtcid:string):(()=>void) {
    return ():void => {
      this.performCall(easyrtcid);
    };
  }

  convertListToButtons (roomName:string, data:Easyrtc_PerRoomData, isPrimary:boolean):void {
    this.clearConnectList();
    for(let easyrtcid in data) {
      this.connectedClientsList.push(easyrtc.idToName(easyrtcid));
    }
    this.cdr.detectChanges();
  }

  updateMyEasyRTCId(myEasyRTCId:string):void {
    this.myId = myEasyRTCId;
    this.cdr.detectChanges();
  }
  
  loginSuccess(easyrtcid:string):void {
    this.updateMyEasyRTCId(easyrtc.cleanId(easyrtcid));
  }

  loginFailure(errorCode:string, message:string):void {
    this.updateMyEasyRTCId('Login failed. Reason: '+ message);
  }

  connect():void {
    easyrtc.setVideoDims(320,240,undefined);
    let convertListToButtonShim = (roomName:string, data:Easyrtc_PerRoomData, isPrimary:boolean):void => {
      this.convertListToButtons(roomName, data, isPrimary);
    }
    easyrtc.setRoomOccupantListener(convertListToButtonShim);
    easyrtc.easyApp("easyrtc.audioVideoSimple", "videoSelf", ["videoCaller"], this.loginSuccess.bind(this), this.loginFailure.bind(this));
  }

  ngAfterViewInit() {
    this.connect();
  }
  */
}
