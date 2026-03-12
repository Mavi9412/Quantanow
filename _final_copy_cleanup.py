from pathlib import Path
import re
p = Path('index.html')
html = p.read_text(encoding='utf-8')

html = re.sub(r'<div class="copyright-text">.*?</div>', '<div class="copyright-text"> 2026 All rights reserved by <strong>QuantaNow.</strong></div>', html, count=1)

html = html.replace('https://cdn.prod.website-files.com/623865af2eee366912508587/625829ae10b92ad3495f3186_Milestone-Open%20Graph%20(1).png', 'https://cdn.prod.website-files.com/63b6f12d12456beab4f8cd2f/63b81ab0db2af1a5cab35d93_QN%20Horzontal%20l-2.png')

html = html.replace('>Bubble.io</a>', '>AI Automation</a>')
html = html.replace('>WebFlow</a>', '>MVP Build</a>')

p.write_text(html, encoding='utf-8')
print('Applied final content cleanups')
