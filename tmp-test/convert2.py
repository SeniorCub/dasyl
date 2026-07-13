import re

with open('/home/seniorcub/Web_Dev/dasyl/docs-old/index.html', 'r') as f:
    html = f.read()

body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
else:
    body_content = html

# Escape backticks and $ for template literal
body_content = body_content.replace('`', '\\`').replace('$', '\\$')

react_component = f"""
import React, {{ useEffect }} from 'react';
import './styles.css';
import {{ initScript }} from './initScript.js';

function App() {{
  useEffect(() => {{
    initScript();
  }}, []);

  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{body_content}` }}}} />
  );
}}

export default App;
"""

with open('/home/seniorcub/Web_Dev/dasyl/docs/src/App.jsx', 'w') as f:
    f.write(react_component)

print("Conversion complete.")
