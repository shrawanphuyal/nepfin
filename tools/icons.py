# Draws the app icons (night sky, aurora, spruce line, "Fi") with the bundled fonts. Run: python3 tools/icons.py
import pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
import base64
font = 'data:font/woff2;base64,' + base64.b64encode((root / 'src/fonts/bricolage-grotesque-latin-wght-normal.woff2').read_bytes()).decode()
def svg(pad):  # pad: safe zone for maskable icons
    s = 512; r = 0 if pad else 112
    trees = ''.join(f'<path d="M{x} 512 L{x+14} {h} L{x+28} 512Z"/>' for x, h in [(-6,430),(18,395),(44,440),(70,410),(98,450),(126,420),(150,385),(178,445),(204,415),(232,452),(258,400),(286,440),(312,418),(340,455),(366,392),(394,438),(420,412),(448,447),(474,402),(500,436)])
    k = 0.78 if pad else 1
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{s}" height="{s}" viewBox="0 0 512 512">
<defs><radialGradient id="a" cx="28%" cy="34%" r="45%"><stop offset="0" stop-color="#3EE0A5" stop-opacity=".7"/><stop offset="1" stop-color="#3EE0A5" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="62%" cy="24%" r="42%"><stop offset="0" stop-color="#36C3D9" stop-opacity=".55"/><stop offset="1" stop-color="#36C3D9" stop-opacity="0"/></radialGradient>
<radialGradient id="c" cx="88%" cy="40%" r="40%"><stop offset="0" stop-color="#9A82F5" stop-opacity=".6"/><stop offset="1" stop-color="#9A82F5" stop-opacity="0"/></radialGradient>
<clipPath id="r"><rect width="512" height="512" rx="{r}"/></clipPath></defs>
<g clip-path="url(#r)"><rect width="512" height="512" fill="#0E2238"/><rect width="512" height="512" fill="url(#a)"/><rect width="512" height="512" fill="url(#b)"/><rect width="512" height="512" fill="url(#c)"/>
<g fill="#071322">{trees}</g>
<g transform="translate(256 262) scale({k}) translate(-256 -262)"><text x="256" y="330" text-anchor="middle" font-family="B" font-weight="800" font-size="250" fill="#fff" letter-spacing="-10">Fi</text></g></g></svg>'''
html = lambda p: f'<style>@font-face{{font-family:B;src:url({font})}}body{{margin:0;background:transparent}}</style>{svg(p)}'
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 512, 'height': 512})
    for name, pad, size in [('icon-512.png', 0, 512), ('icon-192.png', 0, 192), ('icon-maskable.png', 1, 512), ('apple-touch-icon.png', 1, 180)]:
        pg.set_viewport_size({'width': 512, 'height': 512}); pg.set_content(html(pad)); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
        out = root / 'src/icons' / name
        pg.screenshot(path=str(out), omit_background=True, clip={'x': 0, 'y': 0, 'width': 512, 'height': 512})
        if size != 512:
            pg.set_content(f'<body style="margin:0"><img src="data:image/png;base64,{__import__("base64").b64encode(out.read_bytes()).decode()}" width="{size}" height="{size}"></body>'); pg.set_viewport_size({'width': size, 'height': size}); pg.wait_for_timeout(100)
            pg.screenshot(path=str(out), omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
    b.close()
print('icons done')
