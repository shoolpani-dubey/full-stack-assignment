from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serving the image as static file
app.mount("/odin-api", StaticFiles(directory="sar_images"), name="sar_images")

# Return a JSON response containing seamarks with a JSON file from disk


@app.get("/seamark")
async def get_data():
    filename = "data.json"

    # assume the file is in the root directory of the project
    file_path = f"./seamark_light_range/{filename}"

    return FileResponse(file_path)

# Serving the ui
app.mount("/", StaticFiles(directory="../odin-ui/build",
          html=True), name="index.html")
