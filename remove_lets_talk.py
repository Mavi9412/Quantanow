import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

regex = re.compile(r'[ \t]*<a href="contact\.html"[^>]*>Let\'s Talk</a>\n?', re.MULTILINE)

# specifically for index.html footer which might be on the same line:
# Us</a><a href="contact.html" class="footer-text-link-16px">Let's Talk</a>
# Let's adjust regex to not consume trailing/leading whitespace too aggressively if it's inline.
regex2 = re.compile(r'<a href="contact\.html"[^>]*>Let\'s Talk</a>')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Remove instances where it's on its own line first
    new_content = re.sub(r'^[ \t]*<a href="contact\.html"[^>]*>Let\'s Talk</a>[ \t]*\n', '', content, flags=re.MULTILINE)
    
    # Remove remaining inline instances
    new_content = re.sub(r'<a href="contact\.html"[^>]*>Let\'s Talk</a>', '', new_content)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
