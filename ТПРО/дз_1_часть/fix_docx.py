import os
import shutil
import zipfile
import re
from copy import deepcopy
from lxml import etree

base_path = r"C:\Users\CZA097\Desktop\Учеба\Счастливо\1 курс\1 семестр\ТПРО"
output_dir = os.path.join(base_path, "дз_1_часть")
src_path = os.path.join(output_dir, "Чудновский З.А. ИУ5Ц-11М ТРПО ДЗ_1_часть.docx")
out_path = os.path.join(output_dir, "Чудновский З.А. ИУ5Ц-11М ТРПО ДЗ_1_часть.docx")

W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

tmp_dir = os.path.join(output_dir, '_tmp_fix')
if os.path.exists(tmp_dir):
    shutil.rmtree(tmp_dir)

print("Extracting document...")
with zipfile.ZipFile(src_path, 'r') as z:
    z.extractall(tmp_dir)

doc_path = os.path.join(tmp_dir, 'word', 'document.xml')
tree = etree.parse(doc_path)
root = tree.getroot()
body = root.find(f'{{{W_NS}}}body')

# Collect ALL child elements with their text
children = list(body)
elem_info = []
for i, child in enumerate(children):
    tag = child.tag
    if tag == f'{{{W_NS}}}p':
        texts = list(child.itertext())
        full_text = ''.join(texts).strip()
        elem_info.append({'idx': i, 'type': 'p', 'text': full_text, 'element': child, 'parent': body})
    elif tag == f'{{{W_NS}}}tbl':
        elem_info.append({'idx': i, 'type': 'tbl', 'text': '', 'element': child, 'parent': body})

total = len(elem_info)
print(f"Total elements: {total}")

def get_text(idx):
    return elem_info[idx]['text']

# === REMOVE unwanted sections ===
to_remove = set()

# 1) Remove ДЗ1 Цель работы and Задание (from "Цель работы" through end of "Задание" content)
# Find "Цель работы" after the title page but before "Ход работы"
for i in range(0, total):
    t = get_text(i)
    if t == 'Цель работы' and i < 50:
        # Mark from here to before "Ход работы" or "Модель требований"
        for j in range(i, total):
            t2 = get_text(j)
            if t2 in ('Ход работы', 'Модель требований'):
                break
            to_remove.add(j)
        break

# 2) Remove ДЗ2 title page
# Find "ОТЧЕТ" after "Вывод" (end of ДЗ1)
for i in range(0, total):
    t = get_text(i)
    if t == 'ОТЧЕТ':
        # Find the preceding "ФАКУЛЬТЕТ" with "Информатика"
        # and mark everything from there to before "Цель работы"
        for j in range(i-10, i):
            if get_text(j).startswith('ФАКУЛЬТЕТ') and 'Информатика' in get_text(j):
                for k in range(j, total):
                    if get_text(k) == 'Цель работы':
                        break
                    to_remove.add(k)
                break
        break

# 3) Remove ДЗ2 Цель работы and Вариант работы
for i in range(0, total):
    t = get_text(i)
    if t == 'Цель работы' and 200 < i < 250:
        for j in range(i, total):
            t2 = get_text(j)
            if t2 in ('Ход работы',) or 'Таблица' in t2:
                break
            to_remove.add(j)
        break

# 4) Remove ДЗ3 title page (from "ФАКУЛЬТЕТ ИНФОРМАТИКА И СИСТЕМЫ УПРАВЛЕНИЯ" to before "Цель работы")
for i in range(0, total):
    t = get_text(i)
    if 'ФАКУЛЬТЕТ' in t and 'ИНФОРМАТИКА И СИСТЕМЫ' in t:
        for j in range(i, total):
            t2 = get_text(j)
            if t2 == 'Цель работы':
                break
            to_remove.add(j)
        break

# 5) Remove ДЗ3 Цель работы through Требования
for i in range(0, total):
    t = get_text(i)
    if t == 'Цель работы' and 550 < i < 620:
        for j in range(i, total):
            t2 = get_text(j)
            if t2.startswith('Ход работы'):
                break
            to_remove.add(j)
        break

# Also remove empty paragraphs directly adjacent to removed content
# (this is optional but makes the document cleaner)

# Show what will be removed
print(f"Will remove {len(to_remove)} elements:")
for idx in sorted(to_remove):
    t = get_text(idx)
    if t:
        print(f"  [{idx}] {t[:100]}")
    else:
        print(f"  [{idx}] (empty)")

# === REMOVE from XML ===
for idx in sorted(to_remove, reverse=True):
    parent = elem_info[idx]['element'].getparent()
    parent.remove(elem_info[idx]['element'])

print("Removed elements.")

# === REFRESH - re-parse the document ===
modified_tree = etree.parse(doc_path)
modified_root = modified_tree.getroot()
modified_body = modified_root.find(f'{{{W_NS}}}body')

# === RENUMBER FIGURES ===
# Collect all paragraphs with their text
modified_children = list(modified_body)
paras = []
for child in modified_children:
    if child.tag == f'{{{W_NS}}}p':
        texts = list(child.itertext())
        full_text = ''.join(texts).strip()
        paras.append({'element': child, 'text': full_text})

print(f"Paragraphs after removal: {len(paras)}")

figure_counter = 0
changes = []

for p in paras:
    text = p['text']
    if not text:
        continue
    
    new_text = text
    changed = False
    
    # Detect if this is a figure caption
    # Pattern: starts with Рисунок, Рис., or Рис followed by number or dash
    is_caption = False
    
    # Try various caption patterns
    if re.match(r'^Рисунок\s+\d+(\s*[–\-\.])', text):
        is_caption = True
        figure_counter += 1
        # Replace "Рисунок X" with "Рисунок N"
        new_text = re.sub(r'^(Рисунок\s+)\d+(\s*[–\-\.])', rf'\g<1>{figure_counter}\g<2>', text, count=1)
    
    elif re.match(r'^Рисунок\s+[–\-]', text):
        is_caption = True
        figure_counter += 1
        new_text = re.sub(r'^(Рисунок\s+)[–\-]', rf'\g<1>{figure_counter} –', text, count=1)
    
    elif re.match(r'^Рис\.\s*\d+(\s*[–\-\.])', text):
        is_caption = True
        figure_counter += 1
        new_text = re.sub(r'^(Рис\.\s*)\d+(\s*[–\-\.])', rf'\g<1>{figure_counter}\g<2>', text, count=1)
    
    elif re.match(r'^Рис\s+\d+[\.]', text):
        is_caption = True
        figure_counter += 1
        new_text = re.sub(r'^(Рис\s+)\d+([\.])', rf'\g<1>{figure_counter}\g<2>', text, count=1)
    
    elif re.match(r'^Рис\s+\d+\s*[–\-]', text):
        is_caption = True
        figure_counter += 1
        new_text = re.sub(r'^(Рис\s+)\d+(\s*[–\-])', rf'\g<1>{figure_counter}\g<2>', text, count=1)
    
    if is_caption:
        changes.append((text, new_text))
        # Update the paragraph text in XML
        if new_text != text:
            runs = p['element'].findall(f'{{{W_NS}}}r')
            # Find the first run with text
            for run in runs:
                t_elem = run.find(f'{{{W_NS}}}t')
                if t_elem is not None:
                    # Update first run's text, clear others
                    t_elem.text = new_text
                    t_elem.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
                    break

print(f"\nFigure renumbering ({figure_counter} figures):")
for old, new in changes:
    print(f"  {old[:80]}")
    print(f"  → {new[:80]}")
    print()

# Save
print("Saving...")
modified_tree.write(doc_path, xml_declaration=True, encoding='UTF-8', standalone=True)

# Create final docx
if os.path.exists(out_path):
    os.remove(out_path)

with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    for root_dir, dirs, files_in_dir in os.walk(tmp_dir):
        for fn in files_in_dir:
            file_path = os.path.join(root_dir, fn)
            arcname = os.path.relpath(file_path, tmp_dir)
            zout.write(file_path, arcname)

shutil.rmtree(tmp_dir)
print(f"Done! Saved to: {out_path}")
