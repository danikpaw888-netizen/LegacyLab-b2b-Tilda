from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import urllib.request
import json
ROOT=Path(__file__).resolve().parents[1]
A=ROOT/'dist/assets'
sources={'radio':'30b3ffc9-4ce3-4771-a7d4-b1c3977bc2b4','camera':'a24bccf3-e531-4116-addd-b6d7d7ce8011','access':'f1245cac-8235-47b1-bc27-dc355f89cdb4','switch':'0beeb549-2a6b-4083-8a86-ba3165d9b7c1','accessory':'cf53781b-69d9-4c3d-aa5d-e1da2caa93a2','warehouse':'d5708bcd-ae62-4d2a-ba4c-95c52a407c61'}
G=Path.home()/'.codex/generated_images/01a199ed-1b94-75e1-9a84-e3a59f980b9b'
for name,s in sources.items():
    im=Image.open(G/f'exec-{s}.png').convert('RGB')
    im.thumbnail((1440,1100) if name=='warehouse' else (1000,1000))
    im.save(A/f'{name}.webp',quality=85,method=6)
    if name!='warehouse':
        im.thumbnail((500,500)); im.save(A/f'{name}-small.webp',quality=83,method=6)
url='https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/InterVariable.woff2'
urllib.request.urlretrieve(url,A/'InterVariable.woff2')
urllib.request.urlretrieve('https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt',A/'Inter-LICENSE.txt')
# Link preview is a deterministic graphic with an optimized product photo.
im=Image.new('RGB',(1200,630),'#F3F5F7'); d=ImageDraw.Draw(im)
font='C:/Windows/Fonts/arial.ttf'; bold='C:/Windows/Fonts/arialbd.ttf'
d.rectangle((0,0,16,630),fill='#2358D5')
d.text((65,60),'LEGACYLAB',font=ImageFont.truetype(bold,34),fill='#17212B')
d.text((65,210),'Связь. Контроль.\nВсё по задаче.',font=ImageFont.truetype(bold,57),fill='#17212B',spacing=12)
d.text((65,450),'Оборудование для бизнеса / Казахстан',font=ImageFont.truetype(font,23),fill='#596574')
d.text((65,558),'Демонстрационный проект',font=ImageFont.truetype(font,20),fill='#596574')
radio=Image.open(A/'radio.webp'); radio.thumbnail((530,530)); im.paste(radio,(665,50))
im.save(A/'og.jpg',quality=89)
print('Optimized assets and local Inter saved')
