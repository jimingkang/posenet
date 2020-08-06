/// <reference path="../../../assets/api/easyrtc.d.ts" />

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongSheet, Song, Singer } from '../../services/data-types/common.types';
import { AppStoreModule } from '../../store/index';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { getCurrentSong, getPlayer } from '../../store/selectors/player.selector';
import { SongService } from '../../services/song.service';
import { BatchActionsService } from '../../store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { findIndex } from '../../../../src/app/utils/array';
import { ModalTypes } from '../../store/reducers/member.reducer';
import { MemberService } from '../../services/member.service';
import { SetShareInfo } from '../../store/actions/member.actions';


import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
//import * as dat from '../../../assets/dat/gui/GUI';
import * as dat from 'dat-gui';
//import Stats from 'stats.js';

//import * from './demo_multiparty'



 //jimmy add for global var
 var activeBox=-1 ;  // nothing selected
 var aspectRatio = 4/3;  // standard definition video aspect ratio
 var maxCALLERS = 3;
 var numVideoOBJS = 3+1;
 var layout:any;
 var videoWidth = 600;
 var videoHeight = 500;
 var color = 'aqua';
 var boundingBoxColor ='red';
 var lineWidth = 2;
 //var tryResNetButtonName = 'tryResNetButton';
 //var tryResNetButtonText ='[New] Try ResNet50';
 //var tryResNetButtonTextCss = 'width:100%;text-decoration:underline;';
// var tryResNetButtonBackgroundCss = 'background:#e61d5f;';

 var defaultQuantBytes = 2;
  
 var defaultMobileNetMultiplier = 0.50;
 var defaultMobileNetStride = 16;
 var defaultMobileNetInputResolution = 500;

 var defaultResNetMultiplier = 1.0;
 var defaultResNetStride = 32;
 var  defaultResNetInputResolution = 250;

 var  guiState:any = {
   algorithm: 'multi-pose',
   input: {
     architecture: 'MobileNetV1',
     outputStride: defaultMobileNetStride,
     inputResolution: defaultMobileNetInputResolution,
     multiplier: defaultMobileNetMultiplier,
     quantBytes: defaultQuantBytes
   },
   singlePoseDetection: {
     minPoseConfidence: 0.1,
     minPartConfidence: 0.5,
   },
   multiPoseDetection: {
     maxPoseDetections: 5,
     minPoseConfidence: 0.15,
     minPartConfidence: 0.1,
     nmsRadius: 30.0,
   },
   output: {
     showVideo: true,
     showSkeleton: true,
     showPoints: true,
     showBoundingBox: false,
   },
   net: null,
 };
 //var  net:any;


import {drawBoundingBox, drawKeypoints, drawSkeleton, isMobile, toggleLoadingUI, tryResNetButtonName, tryResNetButtonText, updateTryResNetButtonDatGuiCss} from '../../../assets/api/demo_util';


@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  sheetInfo: SongSheet;

  description = {
    short: '',
    long: ''
  };

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentSong: Song;
  currentIndex = -1;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
  }

  ngOnInit() {
  }

  private listenCurrent() {
    this.store$
    .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
    .subscribe(song => {
      this.currentSong = song;
      if (song) {
        this.currentIndex = findIndex(this.sheetInfo.tracks, song);
      } else {
        this.currentIndex = -1;
      }
    });
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: this.replaceBr('<b>介绍：</b>' + desc),
        long: ''
      };
    } else {
      this.description = {
        short: this.replaceBr('<b>介绍：</b>' + desc.slice(0, 99)) + '...',
        long: this.replaceBr('<b>介绍：</b>' + desc)
      };
    }
  }


  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br />');
  }

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }
  }


  // 添加一首歌曲
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song)
      .subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', '无url!');
        }
      });
    }
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionServe.insertSongs(list);
        }
      }
    });
  }


  // 收藏歌单
  onLikeSheet(id: string) {
    this.memberServe.likeSheet(id).subscribe(() => {
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  onLiveShow(id: number) {
    appInit();
  }
  // 收藏歌曲
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  // 分享
  shareResource(resource: Song | SongSheet, type = 'song') {
    let txt = '';
    if (type === 'playlist') {
      txt = this.makeTxt('歌单', resource.name, (resource as SongSheet).creator.nickname);
    } else {
      txt = this.makeTxt('歌曲', resource.name, (resource as Song).ar);
    }
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
    let makeByStr = '';
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }


  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



//jimmy camera
async  function setupCamera(localVideo:any) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }
const video=localVideo;
 // const video = document.getElementById('localvideo');
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream=localVideo.srcObject;

  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function  loadVideo(localVideo) {
  const video:any = await setupCamera(localVideo);
  video.play();

  return video;
}


/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras:any, net) {
  guiState.net = net;

  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId;
  }
  const gui = new dat.gui.GUI({width: 0});
  gui

  

  let architectureController = null;
  guiState[tryResNetButtonName] = function() {
    architectureController.setValue('ResNet50')
  };
  gui.add(guiState, tryResNetButtonName).name(tryResNetButtonText);
  updateTryResNetButtonDatGuiCss();

  // The single-pose algorithm is faster and simpler but requires only one
  // person to be in the frame or results will be innaccurate. Multi-pose works
  // for more than 1 person
  const algorithmController =
      gui.add(guiState, 'algorithm', ['single-pose', 'multi-pose']);

  // The input parameters have the most effect on accuracy and speed of the
  // network
  let input = gui.addFolder('Input');
  // Architecture: there are a few PoseNet models varying in size and
  // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
  // fastest, but least accurate.
  architectureController =
      input.add(guiState.input, 'architecture', ['MobileNetV1', 'ResNet50']);
  guiState.architecture = guiState.input.architecture;
  // Input resolution:  Internally, this parameter affects the height and width
  // of the layers in the neural network. The higher the value of the input
  // resolution the better the accuracy but slower the speed.
  let inputResolutionController = null;
  function updateGuiInputResolution(
      inputResolution,
      inputResolutionArray,
  ) {
    if (inputResolutionController) {
      inputResolutionController.remove();
    }
    guiState.inputResolution = inputResolution;
    guiState.input.inputResolution = inputResolution;
    inputResolutionController =
        input.add(guiState.input, 'inputResolution', inputResolutionArray);
    inputResolutionController.onChange(function(inputResolution) {
      guiState.changeToInputResolution = inputResolution;
    });
  }

  // Output stride:  Internally, this parameter affects the height and width of
  // the layers in the neural network. The lower the value of the output stride
  // the higher the accuracy but slower the speed, the higher the value the
  // faster the speed but lower the accuracy.
  let outputStrideController = null;
  function updateGuiOutputStride(outputStride, outputStrideArray) {
    if (outputStrideController) {
      outputStrideController.remove();
    }
    guiState.outputStride = outputStride;
    guiState.input.outputStride = outputStride;
    outputStrideController =
        input.add(guiState.input, 'outputStride', outputStrideArray);
    outputStrideController.onChange(function(outputStride) {
      guiState.changeToOutputStride = outputStride;
    });
  }

  // Multiplier: this parameter affects the number of feature map channels in
  // the MobileNet. The higher the value, the higher the accuracy but slower the
  // speed, the lower the value the faster the speed but lower the accuracy.
  let multiplierController = null;
  function updateGuiMultiplier(multiplier, multiplierArray) {
    if (multiplierController) {
      multiplierController.remove();
    }
    guiState.multiplier = multiplier;
    guiState.input.multiplier = multiplier;
    multiplierController =
        input.add(guiState.input, 'multiplier', multiplierArray);
    multiplierController.onChange(function(multiplier) {
      guiState.changeToMultiplier = multiplier;
    });
  }

  // QuantBytes: this parameter affects weight quantization in the ResNet50
  // model. The available options are 1 byte, 2 bytes, and 4 bytes. The higher
  // the value, the larger the model size and thus the longer the loading time,
  // the lower the value, the shorter the loading time but lower the accuracy.
  let quantBytesController = null;
  function updateGuiQuantBytes(quantBytes, quantBytesArray) {
    if (quantBytesController) {
      quantBytesController.remove();
    }
    guiState.quantBytes = +quantBytes;
    guiState.input.quantBytes = +quantBytes;
    quantBytesController =
        input.add(guiState.input, 'quantBytes', quantBytesArray);
    quantBytesController.onChange(function(quantBytes) {
      guiState.changeToQuantBytes = +quantBytes;
    });
  }

  function updateGui() {
    if (guiState.input.architecture === 'MobileNetV1') {
      updateGuiInputResolution(
          defaultMobileNetInputResolution,
          [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800]);
      updateGuiOutputStride(defaultMobileNetStride, [8, 16]);
      updateGuiMultiplier(defaultMobileNetMultiplier, [0.50, 0.75, 1.0]);
    } else {  // guiState.input.architecture === "ResNet50"
      updateGuiInputResolution(
          defaultResNetInputResolution,
          [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800]);
      updateGuiOutputStride(defaultResNetStride, [32, 16]);
      updateGuiMultiplier(defaultResNetMultiplier, [1.0]);
    }
    updateGuiQuantBytes(defaultQuantBytes, [1, 2, 4]);
  }

  updateGui();
  input.open();
  // Pose confidence: the overall confidence in the estimation of a person's
  // pose (i.e. a person detected in a frame)
  // Min part confidence: the confidence that a particular estimated keypoint
  // position is accurate (i.e. the elbow's position)
  let single = gui.addFolder('Single Pose Detection');
  single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
  single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);

  let multi = gui.addFolder('Multi Pose Detection');
  multi.add(guiState.multiPoseDetection, 'maxPoseDetections')
      .min(1)
      .max(20)
      .step(1);
  multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
  multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
  // nms Radius: controls the minimum distance between poses that are returned
  // defaults to 20, which is probably fine for most use cases
  multi.add(guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);
  multi.open();

  let output = gui.addFolder('Output');
  output.add(guiState.output, 'showVideo');
  output.add(guiState.output, 'showSkeleton');
  output.add(guiState.output, 'showPoints');
  output.add(guiState.output, 'showBoundingBox');
  output.open();


  architectureController.onChange(function(architecture) {
    // if architecture is ResNet50, then show ResNet50 options
    updateGui();
    guiState.changeToArchitecture = architecture;
  });

  algorithmController.onChange(function(value) {
    switch (guiState.algorithm) {
      case 'single-pose':
        multi.close();
        single.open();
        break;
      case 'multi-pose':
        single.close();
        multi.open();
        break;
    }
  });
  
}


/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
   //jimmy comment
  //stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
//  document.getElementById('main').appendChild(stats.dom);
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
  function detectPoseInRealTime(video, net,output) {
    const canvas =output;
  //const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame(net) {
    /*
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();
      toggleLoadingUI(true);
      guiState.net = await posenet.load({
        architecture: guiState.changeToArchitecture,
        outputStride: guiState.outputStride,
        inputResolution: guiState.inputResolution,
        multiplier: guiState.multiplier,
      });
      toggleLoadingUI(false);
      guiState.architecture = guiState.changeToArchitecture;
      guiState.changeToArchitecture = null;
    }

    if (guiState.changeToMultiplier) {
      guiState.net.dispose();
      toggleLoadingUI(true);
      guiState.net = await posenet.load({
        architecture: guiState.architecture,
        outputStride: guiState.outputStride,
        inputResolution: guiState.inputResolution,
        multiplier: guiState.changeToMultiplier,
        quantBytes: guiState.quantBytes
      });
      toggleLoadingUI(false);
      guiState.multiplier = +guiState.changeToMultiplier;
      guiState.changeToMultiplier = null;
    }

    if (guiState.changeToOutputStride) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();
      toggleLoadingUI(true);
      guiState.net = await posenet.load({
        architecture: guiState.architecture,
        outputStride: guiState.changeToOutputStride,
        inputResolution: guiState.inputResolution,
        multiplier: guiState.multiplier,
        quantBytes: guiState.quantBytes
      });
      toggleLoadingUI(false);
      guiState.outputStride = +guiState.changeToOutputStride;
      guiState.changeToOutputStride = null;
    }

    if (guiState.changeToInputResolution) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();
      toggleLoadingUI(true);
      guiState.net = await posenet.load({
        architecture: guiState.architecture,
        outputStride: guiState.outputStride,
        inputResolution: guiState.changeToInputResolution,
        multiplier: guiState.multiplier,
        quantBytes: guiState.quantBytes
      });
      toggleLoadingUI(false);
      guiState.inputResolution = +guiState.changeToInputResolution;
      guiState.changeToInputResolution = null;
    }

    if (guiState.changeToQuantBytes) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();
      toggleLoadingUI(true);
      guiState.net = await posenet.load({
        architecture: guiState.architecture,
        outputStride: guiState.outputStride,
        inputResolution: guiState.inputResolution,
        multiplier: guiState.multiplier,
        quantBytes: guiState.changeToQuantBytes
      });
      toggleLoadingUI(false);
      guiState.quantBytes = guiState.changeToQuantBytes;
      guiState.changeToQuantBytes = null;
    }
    */

    // Begin monitoring code for frames per second
  //  stats.begin();

    let poses = [];
    let minPoseConfidence=0.15; //jimmy set 0.15
    let minPartConfidence=0.5;    //jimmy set 0.1
  //  switch (guiState.algorithm) {
 //     case 'single-pose':
       const pose = await guiState.net.estimatePoses(video, {
          flipHorizontal: flipPoseHorizontal,
          decodingMethod: 'single-person'
        });
        poses = poses.concat(pose);
  //      minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
  //      minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;
  //      break;
 //     case 'multi-pose':
     //   let all_poses = await net.estimatePoses(video, {
     //     flipHorizontal: flipPoseHorizontal,
     //     decodingMethod: 'multi-person',
     //     maxDetections: 5,
     //     scoreThreshold: 0.15,
     //     nmsRadius: 0.1
     //   });

     //   poses = poses.concat(all_poses);
      //  minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
     //   minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;
     //   break;
   // }

    ctx.clearRect(0, 0, 600, 500);  //ctx.clearRect(0, 0,videoWidth, videoHeight)

    if (true) {  // if (guiState.output.showVideo) { 
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-600, 0);  //ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0,videoWidth, videoHeight);   //   ctx.drawImage(video, 0, 0,videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (true) {  //  if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (true) {  //     if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (false) {  // if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });

    // End monitoring code for frames per second
   // stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame(net);
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
  async function  bindPage(localVideo:any,output:any) {
  //toggleLoadingUI(true);

 const net= await posenet.load({
  architecture:  'MobileNetV1',//'guiState.input.architecture',
  outputStride: defaultMobileNetStride ,// guiState.input.outputStride,
  inputResolution: defaultMobileNetInputResolution, //guiState.input.inputResolution,
  multiplier: defaultMobileNetMultiplier ,//guiState.input.multiplier,
  quantBytes: defaultQuantBytes //guiState.input.quantBytes
});

  //toggleLoadingUI(false);

  let video;

  try {
    video = await loadVideo(localVideo);
  } catch (e) {
    //let info = document.getElementById('info');
   var err_msg= 'this browser does not support video capture,' +
        'or this device does not have a camera';
    //info.style.display = 'block';
  console.log(err_msg);
    throw e;
  }

  setupGui([], net);
  //setupFPS();
  detectPoseInRealTime(video, net,output);
}
//end jimmy camera



//Jimmy demo_multipart
var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;
var layout;


easyrtc.dontAddCloseButtons();

function getIdOfBox(boxNum) {
    return "box" + boxNum;
}
function getIdOfcanvas(boxNum) {
  return "canvas" + boxNum;
}


function reshapeFull(parentw, parenth) {
    return {
        left:0,
        top:0,
        width:parentw,
        height:parenth
    };
}

function reshapeTextEntryBox(parentw, parenth) {
    return {
        left:parentw/4,
        top:parenth/4,
        width:parentw/2,
        height: parenth/4
    }
}

function reshapeTextEntryField(parentw, parenth) {
    return {
        width:parentw -40
    }
}

var margin = 20;

function reshapeToFullSize(parentw, parenth) {
    var left, top, width, height;
    var margin= 20;

    if( parentw < parenth*aspectRatio){
        width = parentw -margin;
        height = width/aspectRatio;
    }
    else {
        height = parenth-margin;
        width = height*aspectRatio;
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
function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

    var width, height;
    if( parentw < parenth*aspectRatio){
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


function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
}

function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
}


var sharedVideoWidth  = 1;
var sharedVideoHeight = 1;

function reshape1of2(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}



function reshape2of2(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3 *2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape1of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4 ,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape2of3(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape3of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*3+ sharedVideoHeight*2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
            top:  (parenth -sharedVideoHeight*2)/3*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}


function reshape1of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape2of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}
function reshape3of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape4of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

var boxUsed = [true, false, false, false];
var connectCount = 0;


function setSharedVideoSize(parentw, parenth) {
    layout = ((parentw /aspectRatio) < parenth)?'p':'l';
    var w, h;

    function sizeBy(fullsize, numVideos) {
        return (fullsize - margin*(numVideos+1) )/numVideos;
    }

    switch(layout+(connectCount+1)) {
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
    sharedVideoWidth = Math.min(w, h * aspectRatio);
    sharedVideoHeight = Math.min(h, w/aspectRatio);
}

var reshapeThumbs = [
    function(parentw, parenth) {

        if( activeBox > 0 ) {
            return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
        }
        else {
            setSharedVideoSize(parentw, parenth)
            switch(connectCount) {
                case 0:return reshapeToFullSize(parentw, parenth);
                case 1:return reshape1of2(parentw, parenth);
                case 2:return reshape1of3(parentw, parenth);
                case 3:return reshape1of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[1]) {
            return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount) {
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape2of3(parentw, parenth);
                case 3:
                    return reshape2of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[2] ) {
            return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
        }
        else  {
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    if( !boxUsed[1]) {
                        return reshape2of3(parentw, parenth);
                    }
                    else {
                        return reshape3of3(parentw, parenth);
                    }
                
                case 3:
                    return reshape3of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[3]) {
            return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape3of3(parentw, parenth);
                case 3:
                    return reshape4of4(parentw, parenth);
            }
        }
    },
];


function killButtonReshaper(parentw, parenth) {
    var imagew = 128;
    var imageh = 128;
    if( parentw < parenth) {
        return setThumbSizeButton(0.1, -0.51, -0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.1, -0.01, -0.51, parentw, parenth, imagew, imageh);
    }
}


function muteButtonReshaper(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, -0.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, -0.51, parentw, parenth, imagew, imageh);
    }
}

function reshapeTextEntryButton(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, 0.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, 0.51, parentw, parenth, imagew, imageh);
    }
}


function handleWindowResize() {
    var fullpage = document.getElementById('fullpage');
    fullpage.style.width = window.innerWidth + "px";
    fullpage.style.height = window.innerHeight + "px";
    connectCount = easyrtc.getConnectionCount();

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


function setReshaper(elementId, reshapeFn) {
    var element:any = document.getElementById(elementId);
    if( !element) {
        alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
    }
    if( !reshapeFn) {
        alert("Attempt to apply misnamed reshapeFn to element " + elementId);
    }
    element.reshapeMe = reshapeFn;
}


function collapseToThumbHelper() {
    if( activeBox >= 0) {
        var id = getIdOfBox(activeBox);
        document.getElementById(id).style.zIndex = '2';
        setReshaper(id, reshapeThumbs[activeBox]);
        document.getElementById('muteButton').style.display = "none";
        document.getElementById('killButton').style.display = "none";
        activeBox = -1;
    }
}

function collapseToThumb() {
    collapseToThumbHelper();
    activeBox = -1;
    updateMuteImage(false);
    handleWindowResize();

}

function updateMuteImage(toggle) {
    var muteButton:any = document.getElementById('muteButton');
    if( activeBox > 0) { // no kill button for self video
        muteButton.style.display = "block";
        var videoObject:any = document.getElementById( getIdOfBox(activeBox));
        var isMuted = videoObject.muted?true:false;
        if( toggle) {
            isMuted = !isMuted;
            videoObject.muted = isMuted;
        }
        muteButton.src = isMuted?"images/button_unmute.png":"images/button_mute.png";
    }
    else {
        muteButton.style.display = "none";
    }
}


function expandThumb(whichBox) {
    var lastActiveBox = activeBox;
    if( activeBox >= 0 ) {
        collapseToThumbHelper();
    }
    if( lastActiveBox != whichBox) {
        var id = getIdOfBox(whichBox);
        activeBox = whichBox;
        setReshaper(id, reshapeToFullSize);
        document.getElementById(id).style.zIndex = '1';
        if( whichBox > 0) {
            document.getElementById('muteButton').style.display = "block";
            updateMuteImage(false);
            document.getElementById('killButton').style.display = "block";
        }
    }
    updateMuteImage(false);
    handleWindowResize();
}

function prepVideoBox(whichBox) {
    var id = getIdOfBox(whichBox);
    setReshaper(id, reshapeThumbs[whichBox]);
    document.getElementById(id).onclick = function() {
        expandThumb(whichBox);
    };
}


function killActiveBox() {
    if( activeBox > 0) {
        var easyrtcid = easyrtc.getIthCaller(activeBox-1);
        collapseToThumb();
        setTimeout( function() {
            easyrtc.hangup(easyrtcid);
        }, 400);
    }
}


function muteActiveBox() {
    updateMuteImage(true);
}




function callEverybodyElse(roomName, otherPeople) {
  console.log('onLiveShow roomName '+roomName);

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
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < maxCALLERS && position > 0) {
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


function loginSuccess() {
    expandThumb(0);  // expand the mirror image initially.
}


function cancelText() {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
}


function sendText(e) {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
    var stringToSend = "";//document.getElementById('textentryField').value;
    if( stringToSend && stringToSend != "") {
        for(var i = 0; i < maxCALLERS; i++ ) {
            var easyrtcid = easyrtc.getIthCaller(i);
            if( easyrtcid && easyrtcid != "") {

              easyrtc.sendPeerMessage(easyrtcid, "im",  stringToSend, function(msgType, msgBody ){
                console.log("message was sent");
               },
               function(errorCode, errorText){
                  console.log("error was " + errorText);
               }
             );
              //  easyrtc.sendPeerMessage(easyrtcid, "im",  stringToSend);
            }
        }
    }
    return false;
}


function showTextEntry() {
    //document.getElementById('textentryField').value = "";
    document.getElementById('textentryBox').style.display = "block";
    document.getElementById('textEntryButton').style.display = "none";
    document.getElementById('textentryField').focus();
}


function showMessage(startX, startY, content) {
    var fullPage:any = document.getElementById('fullpage');
    var fullW = parseInt(fullPage.offsetWidth);
    var fullH = parseInt(fullPage.offsetHeight);
    var centerEndX = 0.2*startX + 0.8*fullW/2;
    var centerEndY = 0.2*startY + 0.8*fullH/2;


    var cloudObject:any = document.createElement("img");
    cloudObject.src = "images/cloud.png";
    cloudObject.style.width = "1px";
    cloudObject.style.height = "1px";
    cloudObject.style.left = startX + "px";
    cloudObject.style.top = startY + "px";
    fullPage.appendChild(cloudObject);

    cloudObject.onload = function() {
        cloudObject.style.left = startX + "px";
        cloudObject.style.top = startY + "px";
        cloudObject.style.width = "4px";
        cloudObject.style.height = "4px";
        cloudObject.style.opacity = 0.7;
        cloudObject.style.zIndex = 5;
        cloudObject.className = "transit boxCommon";
        var textObject;
        function removeCloud() {
            if( textObject) {
                fullPage.removeChild(textObject);
                fullPage.removeChild(cloudObject);
            }
        }
        setTimeout(function() {
            cloudObject.style.left = centerEndX - fullW/4 + "px";
            cloudObject.style.top = centerEndY - fullH/4+ "px";
            cloudObject.style.width = (fullW/2) + "px";
            cloudObject.style.height = (fullH/2) + "px";
        }, 10);
        setTimeout(function() {
            textObject = document.createElement('div');
            textObject.className = "boxCommon";
            textObject.style.left = Math.floor(centerEndX-fullW/8) + "px";
            textObject.style.top = Math.floor(centerEndY) + "px";
            textObject.style.fontSize = "36pt";
            textObject.style.width = (fullW*0.4) + "px";
            textObject.style.height = (fullH*0.4) + "px";
            textObject.style.zIndex = 6;
            textObject.appendChild( document.createTextNode(content));
            fullPage.appendChild(textObject);
            textObject.onclick = removeCloud;
            cloudObject.onclick = removeCloud;
        }, 1000);
        setTimeout(function() {
            cloudObject.style.left = startX + "px";
            cloudObject.style.top = startY + "px";
            cloudObject.style.width = "4px";
            cloudObject.style.height = "4px";
            fullPage.removeChild(textObject);
        }, 9000);
        setTimeout(function(){
            fullPage.removeChild(cloudObject);
        }, 10000);
    }
}

function messageListener(easyrtcid, msgType, content) {
    for(var i = 0; i < maxCALLERS; i++) {
        if( easyrtc.getIthCaller(i) == easyrtcid) {
            var startArea:any = document.getElementById(getIdOfBox(i+1));
            var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
            var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;
            showMessage(startX, startY, content);
        }
    }
}


function appInit() {

    // Prep for the top-down layout manager
    setReshaper('fullpage', reshapeFull);
    for(var i = 0; i < numVideoOBJS; i++) {
        prepVideoBox(i);
    }
    setReshaper('killButton', killButtonReshaper);
    setReshaper('muteButton', muteButtonReshaper);
    setReshaper('textentryBox', reshapeTextEntryBox);
    setReshaper('textentryField', reshapeTextEntryField);
    setReshaper('textEntryButton', reshapeTextEntryButton);

    updateMuteImage(true);
    window.onresize = handleWindowResize;
    handleWindowResize(); //initial call of the top-down layout manager


    easyrtc.setRoomOccupantListener(callEverybodyElse);
   
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], loginSuccess,
    function(errorCode, errorText){
      console.log(errorText);
     });
    easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });

    var box0=document.getElementById('box0');
	var canvas0=document.getElementById('canvas0');
	bindPage(box0,canvas0);
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        console.log("slot="  + slot );
        
        
          boxUsed[slot+1] = true;
          if(activeBox == 0 ) { // first connection
              collapseToThumb();
              document.getElementById('textEntryButton').style.display = 'block';
          }
        //document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden"; //document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
        if((slot+1)==1 )
        {
          bindPage(document.getElementById(getIdOfBox(slot+1)),document.getElementById(getIdOfcanvas(slot+1))); 
          handleWindowResize();
        }
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
        if(activeBox > 0 && slot+1 == activeBox) {
            collapseToThumb();
        }
        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
                expandThumb(0);
                document.getElementById('textEntryButton').style.display = 'none';
                document.getElementById('textentryBox').style.display = 'none';
            }
            handleWindowResize();
        },20);
    });
}

/*
//easyrtc.dontAddCloseButtons();
function getIdOfBox(boxNum) {
  return "box" + boxNum;
}
function reshapeFull(parentw, parenth) {
  return {
      left:0,
      top:0,
      width:parentw,
      height:parenth
  };
}

function reshapeTextEntryBox(parentw, parenth) {
  return {
      left:parentw/4,
      top:parenth/4,
      width:parentw/2,
      height: parenth/4
  }
}

function reshapeTextEntryField(parentw, parenth) {
  return {
      width:parentw -40
  }
}

var margin = 20;

function reshapeToFullSize(parentw, parenth) {
  var left, top, width, height;
  var margin= 20;

  if( parentw < parenth*aspectRatio){
      width = parentw -margin;
      height = width/aspectRatio;
  }
  else {
      height = parenth-margin;
      width = height*aspectRatio;
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
function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

  var width, height;
  if( parentw < parenth*aspectRatio){
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


function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
  return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
}

function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
  return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
}


var sharedVideoWidth  = 1;
var sharedVideoHeight = 1;

function reshape1of2(parentw, parenth) {
  if( layout== 'p' ) {
      return {
          left: (parentw-sharedVideoWidth)/2,
          top:  (parenth -sharedVideoWidth*2)/3,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      };
  }
  else {
      return{
          left: (parentw-sharedVideoWidth*2)/3,
          top:  (parenth -sharedVideoWidth)/2,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      }
  }
}



function reshape2of2(parentw, parenth){
  if( layout== 'p' ) {
      return {
          left: (parentw-sharedVideoWidth)/2,
          top:  (parenth -sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      };
  }
  else {
      return{
          left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
          top:  (parenth -sharedVideoWidth)/2,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      }
  }
}

function reshape1of3(parentw, parenth) {
  if( layout== 'p' ) {
      return {
          left: (parentw-sharedVideoWidth)/2,
          top:  (parenth -sharedVideoWidth*3)/4 ,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      };
  }
  else {
      return{
          left: (parentw-sharedVideoWidth*2)/3,
          top:  (parenth -sharedVideoWidth*2)/3,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      }
  }
}

function reshape2of3(parentw, parenth){
  if( layout== 'p' ) {
      return {
          left: (parentw-sharedVideoWidth)/2,
          top:  (parenth -sharedVideoWidth*3)/4*2+ sharedVideoWidth,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      };
  }
  else {
      return{
          left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
          top:  (parenth -sharedVideoWidth*2)/3,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      }
  }
}

function reshape3of3(parentw, parenth) {
  if( layout== 'p' ) {
      return {
          left: (parentw-sharedVideoWidth)/2,
          top:  (parenth -sharedVideoWidth*3)/4*3+ sharedVideoWidth*2,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      };
  }
  else {
      return{
          left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
          top:  (parenth -sharedVideoWidth*2)/3*2+ sharedVideoWidth,
          width: sharedVideoWidth,
          height: sharedVideoWidth
      }
  }
}


function reshape1of4(parentw, parenth) {
  return {
      left: (parentw - sharedVideoWidth*2)/3,
      top: (parenth - sharedVideoWidth*2)/3,
      width: sharedVideoWidth,
      height: sharedVideoWidth
  }
}

function reshape2of4(parentw, parenth) {
  return {
      left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
      top: (parenth - sharedVideoWidth*2)/3,
      width: sharedVideoWidth,
      height: sharedVideoWidth
  }
}
function reshape3of4(parentw, parenth) {
  return {
      left: (parentw - sharedVideoWidth*2)/3,
      top: (parenth - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
      width: sharedVideoWidth,
      height: sharedVideoWidth
  }
}

function reshape4of4(parentw, parenth) {
  return {
      left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
      top: (parenth - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
      width: sharedVideoWidth,
      height: sharedVideoWidth
  }
}

var boxUsed = [true, false, false, false];
var connectCount = 0;


function setSharedVideoSize(parentw, parenth) {
  layout = ((parentw /aspectRatio) < parenth)?'p':'l';
  var w, h;

   function sizeBy(fullsize, numVideos) {
      return (fullsize - margin*(numVideos+1) )/numVideos;
  }

  switch(layout+(connectCount+1)) {
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
  sharedVideoWidth = Math.min(w, h * aspectRatio);
  sharedVideoWidth = Math.min(h, w/aspectRatio);
}

var reshapeThumbs = [
   function(parentw, parenth) {

      if( activeBox > 0 ) {
          return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
      }
      else {
          setSharedVideoSize(parentw, parenth)
          switch(connectCount) {
              case 0:return reshapeToFullSize(parentw, parenth);
              case 1:return reshape1of2(parentw, parenth);
              case 2:return reshape1of3(parentw, parenth);
              case 3:return reshape1of4(parentw, parenth);
          }
      }
  },
   function(parentw, parenth) {
      if( activeBox >= 0 || !boxUsed[1]) {
          return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
      }
      else{
          switch(connectCount) {
              case 1:
                  return reshape2of2(parentw, parenth);
              case 2:
                  return reshape2of3(parentw, parenth);
              case 3:
                  return reshape2of4(parentw, parenth);
          }
      }
  },
   function(parentw, parenth) {
      if( activeBox >= 0 || !boxUsed[2] ) {
          return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
      }
      else  {
          switch(connectCount){
              case 1:
                  return reshape2of2(parentw, parenth);
              case 2:
                  if( !boxUsed[1]) {
                      return reshape2of3(parentw, parenth);
                  }
                  else {
                      return reshape3of3(parentw, parenth);
                  }
              
              case 3:
                  return reshape3of4(parentw, parenth);
          }
      }
  },
   function(parentw, parenth) {
      if( activeBox >= 0 || !boxUsed[3]) {
          return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
      }
      else{
          switch(connectCount){
              case 1:
                  return reshape2of2(parentw, parenth);
              case 2:
                  return reshape3of3(parentw, parenth);
              case 3:
                  return reshape4of4(parentw, parenth);
          }
      }
  },
];


function killButtonReshaper(parentw, parenth) {
  var imagew = 128;
  var imageh = 128;
  if( parentw < parenth) {
      return setThumbSizeButton(0.1, -0.51, -0.01, parentw, parenth, imagew, imageh);
  }
  else {
      return setThumbSizeButton(0.1, -0.01, -0.51, parentw, parenth, imagew, imageh);
  }
}


function muteButtonReshaper(parentw, parenth) {
  var imagew = 32;
  var imageh = 32;
  if( parentw < parenth) {
      return setThumbSizeButton(0.10, -0.51, 0.01, parentw, parenth, imagew, imageh);
  }
  else {
      return setThumbSizeButton(0.10, 0.01, -0.51, parentw, parenth, imagew, imageh);
  }
}

function reshapeTextEntryButton(parentw, parenth) {
  var imagew = 32;
  var imageh = 32;
  if( parentw < parenth) {
      return setThumbSizeButton(0.10, 0.51, 0.01, parentw, parenth, imagew, imageh);
  }
  else {
      return setThumbSizeButton(0.10, 0.01, 0.51, parentw, parenth, imagew, imageh);
  }
}


function handleWindowResize() {
  var fullpage = document.getElementById('fullpage');
  fullpage.style.width = window.innerWidth + "px";
  fullpage.style.height = window.innerHeight + "px";
  connectCount = easyrtc.getConnectionCount();

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


function setReshaper(elementId, reshapeFn) {
  var element:any = document.getElementById(elementId);
  if( !element) {
      alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
  }
  if( !reshapeFn) {
      alert("Attempt to apply misnamed reshapeFn to element " + elementId);
  }
  element.reshapeMe = reshapeFn;
}


function collapseToThumbHelper() {
  if( activeBox >= 0) {
      var id = getIdOfBox(activeBox);
      //jimmy comments 
      document.getElementById(id).style.zIndex = '2';
      setReshaper(id, reshapeThumbs[activeBox]);
      document.getElementById('muteButton').style.display = "none";
      document.getElementById('killButton').style.display = "none";
      activeBox = -1;
  }
}

function collapseToThumb() {
  collapseToThumbHelper();
  activeBox = -1;
  updateMuteImage(false);
  handleWindowResize();

}

function updateMuteImage(toggle) {
  var muteButton :any= document.getElementById('muteButton');
  if( activeBox > 0) { // no kill button for self video
      muteButton.style.display = "block";
      var videoObject :any= document.getElementById( getIdOfBox(activeBox));
   
      var isMuted = videoObject.muted?true:false;
      if( toggle) {
          isMuted = !isMuted;
          videoObject.muted = isMuted;
      }
      muteButton.src = isMuted?"images/button_unmute.png":"images/button_mute.png";
  }
  else {
      muteButton.style.display = "none";
  }
}


function expandThumbCallBack() {
var whichBox=0;
var lastActiveBox = activeBox;
if( activeBox >= 0 ) {
  collapseToThumbHelper();
}
if( lastActiveBox != whichBox) {
    var id =getIdOfBox(whichBox);
    activeBox = whichBox;
    setReshaper(id, reshapeToFullSize);
    //jimmy comment 
    document.getElementById(id).style.zIndex ='1';
    if( whichBox > 0) {
        document.getElementById('muteButton').style.display = "block";
        updateMuteImage(false);
        document.getElementById('killButton').style.display = "block";
    }
}
updateMuteImage(false);
handleWindowResize();
}

function expandThumb(whichBox) {
  var lastActiveBox = activeBox;
  if( activeBox >= 0 ) {
    collapseToThumbHelper();
  }
  if( lastActiveBox != whichBox) {
      var id =getIdOfBox(whichBox);
      activeBox = whichBox;
      setReshaper(id, reshapeToFullSize);
      //jimmy comment 
      document.getElementById(id).style.zIndex ='1';
      if( whichBox > 0) {
          document.getElementById('muteButton').style.display = "block";
          updateMuteImage(false);
          document.getElementById('killButton').style.display = "block";
      }
  }
  updateMuteImage(false);
  handleWindowResize();
}

function prepVideoBox(whichBox:any) {
  var id = getIdOfBox(whichBox);
  setReshaper(id, reshapeThumbs[whichBox]);

  //jimmy commenty
//  document.getElementById(id).onclick =  function() {
 //   expandThumb(whichBox);
//  };
}


function killActiveBox() {
  if( activeBox > 0) {
      var easyrtcid = easyrtc.getIthCaller(activeBox-1);
      collapseToThumb();
      setTimeout(  function() {
          easyrtc.hangup(easyrtcid);
      }, 400);
  }
}


function muteActiveBox() {
  updateMuteImage(true);
}




function callEverybodyElse(roomName, otherPeople) {

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
          if( connectCount < maxCALLERS && position > 0) {
              establishConnection(position-1);
          }
      }
       function callFailure(errorCode, errorText) {
          easyrtc.showError(errorCode, errorText);
          if( connectCount < maxCALLERS && position > 0) {
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


function loginSuccess() {
  expandThumb(0);  // expand the mirror image initially.
}


function cancelText() {
  document.getElementById('textentryBox').style.display = "none";
  document.getElementById('textEntryButton').style.display = "block";
}


function sendText(e) {
  document.getElementById('textentryBox').style.display = "none";
  document.getElementById('textEntryButton').style.display = "block";
  var stringToSend ="test";// document.getElementById('textentryField').value;
  if( stringToSend && stringToSend != "") {
      for(var i = 0; i < maxCALLERS; i++ ) {
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


function showTextEntry() {
  //document.getElementById('textentryField').value = "";
  document.getElementById('textentryBox').style.display = "block";
  document.getElementById('textEntryButton').style.display = "none";
  document.getElementById('textentryField').focus();
}


function showMessage(startX, startY, content) {
  //jimmy comments
  var fullPage:any = document.getElementById('fullpage');
  var fullW = parseInt(fullPage.offsetWidth);
  var fullH = parseInt(fullPage.offsetHeight);
  var centerEndX = 0.2*startX + 0.8*fullW/2;
  var centerEndY = 0.2*startY + 0.8*fullH/2;
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
  fullPage.appendChild(cloudObject);

  cloudObject.onload =  function() {
      cloudObject.style.left = startX + "px";
      cloudObject.style.top = startY + "px";
      cloudObject.style.width = "4px";
      cloudObject.style.height = "4px";
      cloudObject.style.opacity = '0.7';
      cloudObject.style.zIndex = '5';
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

function messageListener(easyrtcid, msgType, content) {
  for(var i = 0; i < maxCALLERS; i++) {
      if( easyrtc.getIthCaller(i) == easyrtcid) {
          var startArea:any = document.getElementById(getIdOfBox(i+1));
          //jimmy comnet
          var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
          var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;

      
          showMessage(startX, startY, content);
      }
  }
}


function appInit() {

  // Prep for the top-down layout manager
  setReshaper('fullpage', reshapeFull);
  for(var i = 0; i < numVideoOBJS; i++) {
    prepVideoBox(i);
  }
  setReshaper('killButton', killButtonReshaper);
  setReshaper('muteButton', muteButtonReshaper);
  setReshaper('textentryBox', reshapeTextEntryBox);
  setReshaper('textentryField', reshapeTextEntryField);
  setReshaper('textEntryButton', reshapeTextEntryButton);

  updateMuteImage(false);
  window.onresize = handleWindowResize;
  handleWindowResize(); //initial call of the top-down layout manager


  easyrtc.setRoomOccupantListener(callEverybodyElse);
  easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], expandThumbCallBack,
                 function(errorCode, errorText){
                   console.log(errorText);
                  });
  easyrtc.setPeerListener(messageListener);
  easyrtc.setDisconnectListener(  function() {
      easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
  });
var box0=document.getElementById('box0');
var canvas0=document.getElementById('canvas0');
//bindPage(box0,canvas0);
  easyrtc.setOnCall(  function(easyrtcid, slot) {
      console.log("getConnection count="  + easyrtc.getConnectionCount() );
      boxUsed[slot+1] = true;
      if(activeBox == 0 ) { // first connection
        collapseToThumb();
          document.getElementById('textEntryButton').style.display = 'block';
      }
      document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
  
      handleWindowResize();
  });


  easyrtc.setOnHangup( function(easyrtcid, slot) {
    boxUsed[slot+1] = false;
      if(activeBox > 0 && slot+1 == activeBox) {
        collapseToThumb();
      }
      setTimeout( function() {
          document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";

          if( easyrtc.getConnectionCount() == 0 ) { // no more connections
            expandThumb(0);
              document.getElementById('textEntryButton').style.display = 'none';
              document.getElementById('textentryBox').style.display = 'none';
          }
          handleWindowResize();
      },20);
  });
}
*/

