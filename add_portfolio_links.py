import os

files = ['index.html', 'services.html', 'process.html', 'why-us.html', 'industries.html', 'contact.html']
base_dir = r'c:\Users\Asim\Desktop\Quantanow'

for file in files:
    path = os.path.join(base_dir, file)
    if not os.path.exists(path): continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
        
    # NAVBAR REPLACEMENTS
    nav_standard = '<a href="process.html" class="black-nav-links w-nav-link">Process</a>'
    nav_current = '<a href="process.html" aria-current="page" class="black-nav-links w-nav-link w--current">Process</a>'
    
    if nav_standard in content:
        content = content.replace(nav_standard, nav_standard + '\n                    <a href="portfolio.html" class="black-nav-links w-nav-link">Portfolio</a>')
    elif nav_current in content:
        content = content.replace(nav_current, nav_current + '\n                    <a href="portfolio.html" class="black-nav-links w-nav-link">Portfolio</a>')
        
    # FOOTER REPLACEMENTS
    footer_standard = '<a href="process.html" class="footer-text-link-16px">Process</a>'
    footer_current_1 = '<a href="process.html" aria-current="page"\n                                    class="footer-text-link-16px w--current">Process</a>'
    footer_current_2 = '<a href="process.html" aria-current="page" class="footer-text-link-16px w--current">Process</a>'

    if footer_standard in content:
        content = content.replace(footer_standard, footer_standard + '\n                                <a href="portfolio.html" class="footer-text-link-16px">Portfolio</a>')
    elif footer_current_1 in content:
        content = content.replace(footer_current_1, footer_current_1 + '\n                                <a href="portfolio.html" class="footer-text-link-16px">Portfolio</a>')
    elif footer_current_2 in content:
        content = content.replace(footer_current_2, footer_current_2 + '\n                                <a href="portfolio.html" class="footer-text-link-16px">Portfolio</a>')
        
    if original != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
