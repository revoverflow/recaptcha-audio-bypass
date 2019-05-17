import speech_recognition as sr
from os import path
from pydub import AudioSegment

AUDIO_FILE = "F:/audiocaptcha/python/recognize.mp3"
sound = AudioSegment.from_mp3(AUDIO_FILE)

AUDIO_FILE = "F:/audiocaptcha/python/recognize.wav"
sound.export(AUDIO_FILE, format="wav")

r = sr.Recognizer()
with sr.AudioFile(AUDIO_FILE) as source:
    audio = r.record(source)

try:
    recognized = r.recognize_sphinx(audio)
    print(recognized)
except sr.UnknownValueError:
    print("Sphinx could not understand audio")
except sr.RequestError as e:
    print("Sphinx error; {0}".format(e))