var imgs = [];
var avgImg;
var numOfImages = 30;
var selectedImgIndex = 0; // Index of the randomly selected image
var lerpedImg;

function preload() {
    for (let i = 0; i < numOfImages; i++) {
        let filename = "assets/" + i + ".jpg";
        imgs[i] = loadImage(filename);
        console.log("Loaded: " + filename);
    }
}

function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);
    image(imgs[0], 0, 0);

    avgImg = createGraphics(imgs[0].width, imgs[0].height);
    lerpedImg = createGraphics(imgs[0].width, imgs[0].height);
}

function draw() {
    for (let i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    
    avgImg.loadPixels();

    // Nested for-loop to calculate average pixel values
    for (let y = 0; y < imgs[0].height; y++) {
        for (let x = 0; x < imgs[0].width; x++) {
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;

            // Loop through all images to calculate sums
            for (let i = 0; i < numOfImages; i++) {
                let pixelIndex = (x + y * imgs[0].width) * 4; // Convert x, y to pixel index
                sumR += imgs[i].pixels[pixelIndex]; // Add red channel
                sumG += imgs[i].pixels[pixelIndex + 1]; // Add green channel
                sumB += imgs[i].pixels[pixelIndex + 2]; // Add blue channel
            }

            // Calculate average pixel values
            let avgR = sumR / numOfImages;
            let avgG = sumG / numOfImages;
            let avgB = sumB / numOfImages;

            let pixelIndex = (x + y * imgs[0].width) * 4; // Convert x, y to pixel index
            avgImg.pixels[pixelIndex] = avgR; // Set red channel
            avgImg.pixels[pixelIndex + 1] = avgG; // Set green channel
            avgImg.pixels[pixelIndex + 2] = avgB; // Set blue channel
            avgImg.pixels[pixelIndex + 3] = 255; // Set alpha channel
        }
    }
    
    avgImg.updatePixels(); // Update avgImg pixels to reflect changes
    image(avgImg, imgs[0].width, 0); // Draw avgImg to the right of the existing image

    noLoop(); // Stop looping
}

function keyPressed() {
    selectedImgIndex = int(random(numOfImages)); // Select a random image index
    image(imgs[selectedImgIndex], 0, 0); // Draw the selected random image on the left
    loop(); // Resume looping
}

function mouseMoved() {
    if (lerpedImg) {
        lerpedImg = lerpImage(imgs[selectedImgIndex], avgImg, mouseX / width);
        image(lerpedImg, 0, 0);
    }
}

function lerpImage(img1, img2, amount) {
    let lerpedImage = createImage(img1.width, img1.height);
    lerpedImage.loadPixels();

    for (let y = 0; y < img1.height; y++) {
        for (let x = 0; x < img1.width; x++) {
            let pixelIndex = (x + y * img1.width) * 4;
            for (let c = 0; c < 4; c++) {
                lerpedImage.pixels[pixelIndex + c] = lerp(img1.pixels[pixelIndex + c], img2.pixels[pixelIndex + c], amount);
            }
        }
    }

    lerpedImage.updatePixels();
    return lerpedImage;
}



