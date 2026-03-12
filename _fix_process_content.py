from pathlib import Path
p = Path('index.html')
html = p.read_text(encoding='utf-8')

replacements = [
    ('Collaborative Synergy', 'Free Consultation'),
    ('Innovation', 'AI Planning'),
    ('Transparency', 'Build &amp; Test'),
    ('Optimization', 'Launch &amp; Scale'),
    ('Analyze cashflow', 'Launch &amp; Scale'),
    ('Scan invoices, automate data-entry and route approvals, effortlessly, automatically.', 'We align on goals, scope, and product requirements in a focused discovery session.'),
    ('We align business goals, user journeys, and technical scope before writing code.', 'We understand your vision, define scope, and align success metrics from day one.'),
    ('Architecture, UI flow, and delivery roadmap prepared quickly with AI-assisted planning.', 'Architecture, UX flow, and delivery roadmap prepared in days, not weeks.'),
    ('Weekly demos, rapid iterations, and automated QA across each sprint.', 'Weekly demos, rapid iterations, and automated QA in every sprint.'),
    ('Launch in 60 days with support, monitoring, and continuous product improvements.', 'Launch confidently with monitoring, optimization, and post-release growth support.')
]

for old, new in replacements:
    html = html.replace(old, new)

p.write_text(html, encoding='utf-8')
print('Process content updated')
