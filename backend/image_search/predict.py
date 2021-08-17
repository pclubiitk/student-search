import helpers
import time
import pickle
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
	help="path to image to be tested")
ap.add_argument("-e", "--encodings",
	help="path to serialized db of facial encodings. Default: 'assets/encodings.pickle'", default='assets/encodings.pickle')
ap.add_argument("-a", "--align", type=bool, default=False,
	help="Whether to check the alignment first before predicting. if `True`, then more accurate result but slower. Defaluts to `False`")
ap.add_argument("-t", "--top", type=int, default=5,
	help="Number of matches to return. Defalut: 5")
args = vars(ap.parse_args())

pickleFile = open(args["encodings"],'rb')
data = pickle.load(pickleFile)
pickleFile.close()
knownEncodings = data["encodings"]
knownNames = data["names"]

t = time.perf_counter()
print(helpers.recognise(args["image"], knownEncodings, knownNames, align=args["align"], top=args["top"]))
print("Time Taken : {}".format(time.perf_counter()-t))
