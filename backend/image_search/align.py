from helpers import FaceAlign
import glob
import time
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--dataset", required=True,
	help="path to input directory of images. Default = `./images`", default = "./images")
ap.add_argument("-a", "--aligned", required=True,
	help="output path to aligned faces. defaults to `./aligned`",default="./aligned")
ap.add_argument("-p", "--predictor", required=True,
	help="path to predictor. defaults to `assets/shape_predictor_68_face_landmarks.dat`",default="assets/shape_predictor_68_face_landmarks.dat")
args = vars(ap.parse_args())

# List of all images in dataset
image_list = glob.glob(args["dataset"]+"/*",recursive=True)


# Iterating over all images and aligning them
t0 = time.perf_counter()
for i,image in enumerate(image_list):
    t = time.perf_counter()
    
    aligned_image = FaceAlign(image,args["predictor"])[0]
    cv2.imwrite(args["aligned"]+image.split('/')[1].split('.')[0]+".jpg",aligned_image)
    
    print("Processed {}/{}. TimeTaken:{}sec. AvgTime: {}sec.".format(i+1,len(image_list),time.perf_counter()-t,(time.perf_counter()-t0)/(i+1)))

print("Time Elapsed : {}sec".format(time.perf_counter()-t0))
