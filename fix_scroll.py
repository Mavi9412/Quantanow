import sys

html_path = r'c:\Users\Asim\Desktop\Quantanow\index.html'

try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    start_idx = html.find('class="hero-feature-container-1"')
    div_start = html.rfind('<div', 0, start_idx)
    
    count = 0
    end_idx = -1
    for i in range(div_start, len(html)):
        if html.startswith('<div', i):
            count += 1
        elif html.startswith('</div', i):
            count -= 1
            if count == 0:
                end_idx = i + 6
                break
                
    if end_idx != -1:
        container_html = html[div_start:end_idx]
        new_html = html[:end_idx] + '\n' + container_html + html[end_idx:]
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Success")
    else:
        print("Could not parse container.")
except Exception as e:
    print(e)
