from imutils.face_utils import FaceAligner
from imutils.face_utils import rect_to_bb
import dlib
import imutils
import numpy as np
import cv2
import face_recognition

def FaceAlign(image, shape_predictor="image_search/assets/shape_predictor_68_face_landmarks.dat"):
    '''
    return a list of aligned faces
    '''
    faceDetector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(shape_predictor)

    fa = FaceAligner(predictor, desiredFaceWidth=256)

    # load the input image, rcv2_imshowesize it, and convert it to grayscale
    image = cv2.imread(image)
    image = imutils.resize(image, width=800)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # detect faces in the grayscale image
    rects = faceDetector(gray, 2)

    # maintain a list of aligned images
    images = []

    # loop over the face detections
    for rect in rects:
        # extract the ROI of the *original* face, then align the face
        # using facial landmarks
        (x, y, w, h) = rect_to_bb(rect)
        # faceOrig = imutils.resize(image[y:y + h, x:x + w], width=256)
        faceAligned = fa.align(image, gray, rect)

        # cv2_imshow(faceAligned)

        # save output images
        images.append(faceAligned)
    return images

def distanceVector(knownEncodings, image, align=False):
    '''
    knownEncodings: Matrix of precalculated encodings. shape: (#, 128)
    image: path to image.
    align: Whether to align face first? if 'True', it'll be slower but accuracy
    is greater.(keep it True always unless the dataset is too big, Accuracy is
    already very bad for one shot detection)

    Returns a distance vector corresponding to the order as in knownEncodings
    '''
    A = np.concatenate( knownEncodings, axis=0 )
    x,y = np.shape(A)
    im = FaceAlign(image)[0] if align else cv2.imread(image)
    # cv2_imshow(im)
    v = face_recognition.face_encodings(im)[0]
    B = np.concatenate([[v]*x], axis=0 )
    distMat = np.sum(np.multiply(A-B,A-B), axis=1)
    return distMat

def getNames(knownEncodings, knownNames, image, align=False, top=5):
    '''
    knownNames : List of names(roll no) with same order as that of knownEncodings.
    image : path to the image considered
    align : Whether to align face first? if 'True', it'll be slower but accuracy
    is greater.(keep it True always unless the dataset is too big, Accuracy is
    already very bad for one shot detection)
    top : number of matches to return

    Returns a list of predicted roll nos.
    '''
    dist = distanceVector(knownEncodings,image,align)
    names = knownNames
    predictedNames = []
    for i in range(top):
        index = np.argmin(dist)
        predictedNames.append(names[index])
        dist[index] = 10000000
    return predictedNames

def recognise(image, knownEncodings, knownNames, align=False, top=5):
    '''
    image : path to image
    returns predcted roll no with their image.
    '''
    # try:
    return getNames(knownEncodings, knownNames,image,align,top)
    # except:
    print("[Error] Cannot find a face or an image")
