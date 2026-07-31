import os
import glob

html_files = glob.glob('/Users/joelo/Desktop/JOTACONTENIDOPORTAFOLIO/VERSIONES DEL SITIO/31 marz/jota-works/*.html')

new_title_suffix = " | Joel López | Director de Arte & Diseñador Digital"
index_title = "Joel López | Director de Arte & Diseñador Digital"
new_desc = 'Portafolio de Joel López, Director de Arte y Diseñador Digital especializado en branding, campañas digitales y dirección visual.'

for file_path in html_files:
    if "404" in file_path or "gracias" in file_path: continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update lang
    content = content.replace('<html lang="en">', '<html lang="es">')
    
    # We parse manually for title and description to be safe
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if '<title>' in line:
            if 'index.html' in file_path:
                lines[i] = f'    <title>{index_title}</title>'
            else:
                # Extract prefix if any
                import re
                m = re.search(r'<title>(.*?)(\||—|-)(.*?)</title>', line)
                if m:
                    prefix = m.group(1).strip()
                    lines[i] = f'    <title>{prefix}{new_title_suffix}</title>'
                else: # fallback
                    lines[i] = f'    <title>{index_title}</title>'
                    
        elif '<meta name="title"' in line:
            if 'index.html' in file_path:
                lines[i] = f'    <meta name="title" content="{index_title}">'
                
        elif '<meta name="description"' in line:
            # We want to replace the whole line or the content attribute
            import re
            lines[i] = re.sub(r'content="[^"]*"', f'content="{new_desc}"', line)
            
        elif 'content="Portafolio de Joel López. Especialista en creación de sistemas de marcas premium, campañas digitales y dirección visual de alto impacto."' in line:
             lines[i] = line.replace('Portafolio de Joel López. Especialista en creación de sistemas de marcas premium, campañas digitales y dirección visual de alto impacto.', new_desc)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

print("SEO update complete.")
