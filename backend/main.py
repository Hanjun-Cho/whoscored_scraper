from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

def get_chalkboard(content):
    from bs4 import BeautifulSoup
    from json_repair import repair_json
    import json
    soup = BeautifulSoup(content, "html.parser")
    
    target_string = 'require.config.params["args"] = '
    scripts = soup.find_all("script")

    for script in scripts:
        if script.string and target_string in script.string:
            preformat_json = f"'{script.string.lstrip()[len(target_string):]}'"
            repaired_json = repair_json(preformat_json)
            return json.loads(repaired_json)
    
    return {}

@app.get("/get_chalkboard_data")
async def get_chalkboard_data(url: str):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        print(url)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        )
        await page.goto(url)
        content = await page.content()

        data = get_chalkboard(content)
        while data is None: 
            continue
        await browser.close()
        return data
