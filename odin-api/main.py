from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serving the image as static file
app.mount("/odin-api", StaticFiles(directory="sar_images"), name="sar_images")
# Serving the ui
app.mount("/", StaticFiles(directory="../odin-ui/build",
          html=True), name="index.html")
