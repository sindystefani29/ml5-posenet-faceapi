let faceapi;
let video;
let detections;
let poseNet;

const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
};

function setup() {
    createCanvas(360, 270);

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.elt.setAttribute('playsinline', '');
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detectionOptions, modelReady);
    textAlign(RIGHT);
}

function modelReady() {
    console.log("ready!");
    console.log(faceapi);
    faceapi.detect(gotResults);
}

function gotResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(video, 0, 0, width, height);
    if (detections) {
        if (detections.length > 0) {
            // console.log(detections)
            drawBoxContainer()
            poseNetInit()
            drawBox(detections);
            drawLandmarks(detections);
        }
    }
    faceapi.detect(gotResults);
}

function drawBoxContainer() {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(100, 66, 125, 125);
}

function drawBox(detections) {
    for (let i = 0; i < detections.length; i += 1) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x;
        const y = alignedRect._box._y;
        const boxWidth = alignedRect._box._width;
        const boxHeight = alignedRect._box._height;

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);

        console.log(detections)
    }
}

function drawLandmarks(detections) {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);

    for (let i = 0; i < detections.length; i += 1) {
        const mouth = detections[i].parts.mouth;
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);
    }
}

function drawPart(feature, closed) {
    beginShape();
    for (let i = 0; i < feature.length; i += 1) {
        const x = feature[i]._x;
        const y = feature[i]._y;
        vertex(x, y);
    }

    if (closed === true) {
        endShape(CLOSE);
    } else {
        endShape();
    }
}

function modelLoaded() {
    console.log('Model Loaded!');
}

function poseNetInit() {
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', (results) => {
        poses = results;
        console.log(poses)
    });
}