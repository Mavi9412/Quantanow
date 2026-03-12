import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll use a regex that matches the <a> tags for FB, Twitter, and Instagram
# FB
fb_regex = re.compile(r'<a href="https://www\.facebook\.com/".*?<img src="[^"]*Facebook\.svg".*?</a>', re.DOTALL)
# Twitter
tw_regex = re.compile(r'<a href="https://www\.twitter\.com/".*?<img src="[^"]*Twitter\.svg".*?</a>', re.DOTALL)
# Instagram
ig_regex = re.compile(r'<a href="https://www\.instagram\.com/".*?<img src="[^"]*Instagram\.svg".*?</a>', re.DOTALL)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = fb_regex.sub('', content)
    new_content = tw_regex.sub('', new_content)
    new_content = ig_regex.sub('', new_content)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated social links in {f}")
