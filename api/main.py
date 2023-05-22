import spacy
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import logging

hostName = "localhost"
serverPort = 8080

nlp = spacy.load('output_updated/model-best')

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()

        message = "Hello, World! Here is a GET response"
        self.wfile.write(bytes(message, "utf8"))
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length'))

        post_body = self.rfile.read(content_len)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type','application/json')

        self.end_headers()

        # print(str(post_body.decode()))
        processed = nlp(str(post_body.decode()))

        message = {"pos": processed.cats['positive'], "neg": processed.cats['negative']}

        json_string = json.dumps(message)
        self.wfile.write(json_string.encode())

with HTTPServer((hostName, serverPort), handler) as server:
    server.serve_forever()