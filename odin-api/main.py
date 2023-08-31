from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serving the image as static file
app.mount("/odin-api", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return "ODIN-API IS UP."
