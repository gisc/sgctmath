# Usage: python3 tools/pages.py t05,t06 1100 1 outprefix   (needs: python3 -m http.server 8765 in repo root)
# Opens each topic, reveals all explore steps, saves a full-page screenshot to /home/claude/scratch/<prefix><id>.png
# and prints any JS errors.
import asyncio, sys, os
from playwright.async_api import async_playwright
async def main(pages, w, scale, prefix):
    os.makedirs('/home/claude/scratch', exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':w,'height':900}, device_scale_factor=scale)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and 'favicon' not in m.text and errs.append(m.text))
        for t in pages:
            await pg.goto(f'http://localhost:8765/index.html#/t/{t}'); await pg.wait_for_timeout(900)
            if await pg.locator('#allSteps').count(): await pg.click('#allSteps')
            await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'/home/claude/scratch/{prefix}{t}.png', full_page=True)
        print('errors', errs); await b.close()
a=sys.argv
asyncio.run(main(a[1].split(','), int(a[2]), float(a[3]), a[4]))
