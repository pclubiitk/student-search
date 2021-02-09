from flask import abort, g, jsonify, request, Flask, make_response, json
import os, sys
from sqlite3 import connect
import pickle
from image_search.helpers import recognise

from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

DATABASE = os.getenv('DB_LOC', '../database/students.db')


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect(DATABASE)
    return db


def jsonify_single_student(result):
    return {
        'i': result[0],
        'u': result[1],
        'n': result[2],
        'p': result[3],
        'd': result[4],
        'h': result[5],
        'r': result[6],
        'b': result[7],
        'g': result[8],
        'a': result[9]
    }


def jsonify_multiple_students(results):
    return list(map(lambda result: jsonify_single_student(result), results))


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/students')
def get_all_students():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT * FROM students")
    results = c.fetchall()
    return jsonify(jsonify_multiple_students(results))


@app.route('/student')
def get_particular_student():
    username = request.args.get('username')
    if username is None or username is '':
        abort(400)
    db = get_db()
    c = db.cursor()
    print(username)
    c.execute("SELECT * FROM students WHERE username IS ?", (username, ))
    result = c.fetchone()
    if result is None:
        abort(404)
    return jsonify(jsonify_single_student(result))

@app.route('/image-upload', methods=["POST"])
def upload_files():

  path=os.path.join(os.path.join(app.root_path, 'uploads'), secure_filename(request.files['image'].filename))
  #print(path)
  try:
    request.files['image'].save(path)
  except:
    os.mkdir('uploads')
    request.files['image'].save(path)

  try:
    encodings="image_search/assets/encodings.pickle"
    pickleFile = open(encodings,'rb')
    data = pickle.load(pickleFile)
    pickleFile.close()
    knownEncodings = data["encodings"]
    knownNames = data["names"]
    roll=recognise(path, knownEncodings, knownNames, True, 1)[0]

    db = get_db()
    c = db.cursor()
    c.execute("SELECT * FROM students WHERE roll IS ?", (roll, ))
    result = c.fetchone()
  except:
    os.remove(path)
    abort(500)
  os.remove(path)

  if result is None:
    abort(404)

  return jsonify(jsonify_single_student(result))

  # response=make_response()
  # response.response=json.dumps({'result':'b'})
  # response.status_code=200
  # return response
