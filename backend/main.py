from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from enum import Enum
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReturnStatus(Enum):
    SUCCESS = "SUCCESS",
    FAIL = "FAIL"

@app.get("/")
async def root():
    return {"message": "Hello World"}

async def get_chalkboard(content):
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
    
    return {
        "status": ReturnStatus.FAIL,
        "message": "Data was not found within given URL"
    }

def is_valid_URL(url_string):
    import validators
    return validators.url(url_string)

@app.get("/get_chalkboard_data")
async def get_chalkboard_data(url: str):
    from playwright.async_api import async_playwright
    import time
    async with async_playwright() as p:
        if not is_valid_URL(url):
            return {
                "status": ReturnStatus.FAIL,
                "message": "Invalid URL"
            }
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        )

        print("Attempting to Scrape ", url)
        fail_counter = 0
        while True:
            try:
                await page.goto(url)
                content = await page.content()
                break
            except Exception as e:
                print("Failed to load... Retrying...", e)
                fail_counter += 1

                if fail_counter == 10:
                    print("Website exceeded max attempts, stopping Retries")
                    return {
                        "status": ReturnStatus.FAIL,
                        "message": "Website exceeded max attempt to reach"
                    }
                time.sleep(1)

        data = await get_chalkboard(content)
        data["status"] = ReturnStatus.SUCCESS
        await browser.close()
        return data
