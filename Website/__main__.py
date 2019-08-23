import os

from flask import Flask, render_template

__dir__ = os.path.dirname(os.path.abspath(__file__))
print(__dir__)
app = Flask('Chat', 
	static_folder=__dir__+'/public/', 
	template_folder=__dir__+'/app/')

@app.after_request
def add_header(response):
	response.cache_control.no_store = True
	return response

@app.route("/")
def home():
	return render_template("index.html")

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=1004, debug=True)
