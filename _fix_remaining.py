from pathlib import Path
p = Path('index.html')
html = p.read_text(encoding='utf-8')

html = html.replace(
    '&quot;Quanta Now did an excellent job developing our healthcare software solution. From the start, their team took the time to understand our unique needs and challenges. The end result was a well-crafted product that has improved both our operational efficiency and the quality of care we provide. They were incredibly supportive throughout the entire process, addressing any issues quickly and professionally. I wouldnâ\x80\x99t hesitate to recommend their services.&quot;',
    '&quot;From idea to launch, QuantaNow acted like an extension of our team. The product quality, communication, and speed were exceptional, and the final release was production-ready.&quot;'
)

html = html.replace(
    'We believe in doing things weâ\x80\x99re passionate about.',
    'We deliver with honesty, ownership, and complete visibility.'
)

html = html.replace(
    'Â 2023 All rights reserved by <strong>QuantaNow. </strong>',
    ' 2026 All rights reserved by <strong>QuantaNow.</strong>'
)

p.write_text(html, encoding='utf-8')
print('Patched remaining content variants')
