import React, { Component } from "react";

import jsQR from "jsqr";

class WebcamStream extends Component {
  constructor(props) {
    super(props);

    this.videoTag = React.createRef();
    this.canvas = React.createRef();

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    // getting access to webcam
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        const video = this.videoTag.current;
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(this.tick);
      });
  }

  componentDidUpdate() {}

  drawLine(begin, end, color) {
    const canvasElement = this.canvas.current;
    const canvas = canvasElement.getContext("2d");

    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  tick() {
    const video = this.videoTag.current;

    const checkVideoState = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        clearInterval(checkVideoState);

        const canvasElement = this.canvas.current;
        const canvas = canvasElement.getContext("2d");

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(
          video,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        let imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        console.log(imageData);

        var code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log("CODE");
          this.drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            "#FF3B58"
          );
          this.drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            "#FF3B58"
          );
          this.drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            "#FF3B58"
          );
          this.drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            "#FF3B58"
          );
        } else {
        }
      }
    }, 3000);
  }

  render() {
    return (
      <div>
        <video ref={this.videoTag} width="400" height="400" autoPlay />
        <canvas ref={this.canvas} />
      </div>
    );
  }
}

export default WebcamStream;