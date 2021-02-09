import glob
import time
import cv2
import face_recognition
import pickle
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-e", "--encodings", required=True,
	help="output path for encodings. Default = `./assets/encodings.pickle`", default = "./assets/encodings.pickle")
ap.add_argument("-a", "--aligned", required=True,
	help="path to aligned faces(output path of align.py). defaults to `./aligned`",default="./aligned")
args = vars(ap.parse_args())


knownEncodings = []
knownNames = []

image_list = glob.glob(args["aligned"]+'/*',recursive=True)

t = time.perf_counter()
for (i, image) in enumerate(image_list):
    t0 = time.perf_counter()
    mat = cv2.imread(image)
    encoding = face_recognition.face_encodings(mat)
    name = image.split('/')[1].split('.')[0]
    knownEncodings.append(encoding)
    knownNames.append(name)
    print("Processed image {}/{}. Time taken : {}, Avg : {}".format(i + 1,len(image_list),time.perf_counter()-t0,(time.perf_counter()-t)/(i+1)))
print("Encoded {} images. Time Taken : {} sec".format(len(knownEncodings),time.perf_counter()-t))

data = {"encodings": knownEncodings, "names": knownNames}
f = open(args["encodings"], "wb")
f.write(pickle.dumps(data))
f.close()