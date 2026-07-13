import re

def convert_html_to_jsx(html_content):
    # Basic conversions
    jsx = html_content.replace('class=', 'className=')
    jsx = jsx.replace('for=', 'htmlFor=')
    jsx = jsx.replace('novalidate', 'noValidate')
    jsx = jsx.replace('autocomplete=', 'autoComplete=')
    jsx = jsx.replace('stroke-width=', 'strokeWidth=')
    jsx = jsx.replace('stroke-linecap=', 'strokeLinecap=')
    jsx = jsx.replace('stroke-linejoin=', 'strokeLinejoin=')
    
    # Close unclosed tags
    jsx = re.sub(r'<img([^>]*)(?<!/)>', r'<img\1 />', jsx)
    jsx = re.sub(r'<input([^>]*)(?<!/)>', r'<input\1 />', jsx)
    jsx = re.sub(r'<br([^>]*)(?<!/)>', r'<br\1 />', jsx)
    jsx = re.sub(r'<hr([^>]*)(?<!/)>', r'<hr\1 />', jsx)
    
    return jsx

with open('/home/seniorcub/Web_Dev/dasyl/docs-old/index.html', 'r') as f:
    html = f.read()

# Extract body
body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
else:
    body_content = html

jsx_content = convert_html_to_jsx(body_content)

with open('/home/seniorcub/Web_Dev/dasyl/docs-old/script.js', 'r') as f:
    script_content = f.read()

# Escape template literals if any in script
script_content = script_content.replace('`', '\\`').replace('$', '\\$')

react_component = f"""
import React, {{ useEffect }} from 'react';
import './styles.css';

function App() {{
  useEffect(() => {{
    // Ported from script.js
    {script_content}
  }}, []);

  return (
    <>
      {jsx_content}
    </>
  );
}}

export default App;
"""

with open('/home/seniorcub/Web_Dev/dasyl/docs/src/App.jsx', 'w') as f:
    f.write(react_component)

print("Conversion complete.")
