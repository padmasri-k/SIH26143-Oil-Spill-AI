import os

from flask import Flask, send_from_directory
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from a2wsgi import WSGIMiddleware

from backend.app.main import app as fastapi_app


# Project directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")


# --------------------------------------------------
# FRONTEND — React/Vite
# --------------------------------------------------

flask_app = Flask(
    __name__,
    static_folder=DIST_DIR,
    static_url_path=""
)


@flask_app.route("/", defaults={"path": ""})
@flask_app.route("/<path:path>")
def frontend(path):

    file_path = os.path.join(DIST_DIR, path)

    # Serve existing frontend files
    if path and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)

    # React/Vite fallback
    return send_from_directory(DIST_DIR, "index.html")


# --------------------------------------------------
# BACKEND — FastAPI
# --------------------------------------------------

fastapi_wsgi = WSGIMiddleware(fastapi_app)


# --------------------------------------------------
# COMBINE FRONTEND + BACKEND
# --------------------------------------------------

app = DispatcherMiddleware(
    flask_app,
    {
        "/api": fastapi_wsgi
    }
)


# --------------------------------------------------
# LOCAL START
# --------------------------------------------------

if __name__ == "__main__":
    from werkzeug.serving import run_simple

    port = int(os.environ.get("PORT", 8000))

    run_simple(
        "0.0.0.0",
        port,
        app,
        use_reloader=False
    )
