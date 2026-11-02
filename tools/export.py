from pathlib import Path
import re,json,shutil,base64,mimetypes,argparse,os
R=Path(__file__).resolve().parents[1];D=R/'dist';T=R/'tilda';O=R/'offline'
args=argparse.ArgumentParser();args.add_argument('--asset-base',help='HTTPS directory containing assets, e.g. your own CDN /legacylab/assets/');args.add_argument('--asset-map',help='JSON mapping asset filenames to actual HTTPS URLs');args.add_argument('--native-font',action='store_true',help='Use Inter configured in Tilda site fonts instead of embedding the local font');opt=args.parse_args()
if opt.asset_base and not opt.asset_base.startswith('https://'):raise SystemExit('--asset-base must be HTTPS')
assetmap=json.loads(Path(opt.asset_map).read_text('utf-8')) if opt.asset_map else {}
data=(D/'assets/catalog.json').read_text('utf-8').replace('</','<\\/')
def asseturl(name):
    if name in assetmap:
        if not assetmap[name].startswith('https://'):raise SystemExit('All asset-map URLs must use HTTPS')
        return assetmap[name]
    if opt.asset_base:return opt.asset_base.rstrip('/')+'/'+name
    file=D/'assets'/name
    mime=mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
    return 'data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode()
css=(D/'assets/site.css').read_text('utf-8');js=(D/'assets/site.js').read_text('utf-8')
fontcss=re.sub(r'@font-face\{[^}]*\}', '', css) if opt.native_font else css
style=re.sub(r'/assets/([\w.-]+)',lambda m:asseturl(m[1]),fontcss)
routes={'/':'/','/catalog/':'/catalog','/privacy/':'/privacy'}
for p in json.loads(data):routes['/equipment/'+p['id']+'/']='/'+p['id']
(T/'embeds').mkdir(parents=True,exist_ok=True)
(T/'sections').mkdir(parents=True,exist_ok=True)
def urlrewrite(s):
    def replace(m):
        value=m[1];base,sep,frag=value.partition('#');page,qs,q=base.partition('?');return 'href="'+routes.get(page,page)+(qs+q if qs else '')+(sep+frag if sep else '')+'"'
    return re.sub(r'href="(/[^"\s]*)"',replace,s)
def bundle(markup):
    markup=urlrewrite(markup)
    markup=re.sub(r'/assets/([\w.-]+)',lambda m:asseturl(m[1]),markup)
    # Neutralize Tilda's common global link color; all site styles are scoped.
    extra='#allrecords .ll-site a{color:inherit}#allrecords .ll-site a.btn.primary{color:#fff}#allrecords .ll-site a.text-link,#allrecords .ll-site .category-link,#allrecords .ll-site .card-bottom>a{color:#2358D5}.ll-site a.btn.primary{color:#fff}'
    payload='<script type="application/json" id="ll-catalog-data">'+data+'</script>' if 'id="catalog-grid"' in markup else ''
    return '<!-- LegacyLab demo. One interactive wrapper per page. -->\n<style>'+style+extra+'</style>\n<div class="ll-site">'+markup+payload+'</div>\n<script>'+js+'</script>'
for file in D.rglob('*.html'):
    if file.name in ['qa.html','404.html']:continue
    page='/' if file==D/'index.html' else '/'+file.parent.relative_to(D).as_posix()+'/'
    s=file.read_text('utf-8');body=re.search(r'<body[^>]*>([\s\S]*)</body>',s)[1]
    slug='home' if page=='/' else page.strip('/').replace('/','-')
    (T/'embeds'/f'{slug}.html').write_text(bundle(body),'utf-8')
    # Hybrid: native header/footer in Tilda, exactly one T123 body per internal page.
    if page!='/':
        main=re.search(r'<main[\s\S]*?</main>',body)[0]
        modal=re.search(r'<dialog[\s\S]*?</dialog>',body)[0]
        (T/'sections'/f'{slug}.html').write_text(bundle(main+modal),'utf-8')
(T/'head-demo.html').write_text('<meta name="robots" content="noindex,nofollow,noarchive">\n<meta name="theme-color" content="#2358D5">\n','utf-8')
(T/'route-map.json').write_text(json.dumps(routes,ensure_ascii=False,indent=2),'utf-8')
# Native Tilda form links use documented form-setter URL parameters.
from urllib.parse import urlencode
links=[]
for p in json.loads(data):links.append({'label':p['model']+' — Запросить предложение','url':'/?'+urlencode({'form-setter-product':p['model'],'form-setter-intent':'Коммерческое предложение','form-setter-source_page':'/'+p['id']})+'#request'})
for direction in ['Склады и логистика','Производственные площадки','Офисные и коммерческие здания','Строительные объекты']:links.append({'label':direction+' — Обсудить решение','url':'/?'+urlencode({'form-setter-direction':direction,'form-setter-intent':'Решение для объекта','form-setter-source_page':'/'})+'#request'})
(T/'native-cta-links.json').write_text(json.dumps(links,ensure_ascii=False,indent=2),'utf-8')
# An offline copy has relative paths and inline catalogue data; it does not need a server.
O.mkdir(exist_ok=True);shutil.copytree(D/'assets',O/'assets',dirs_exist_ok=True)
(O/'assets/site.css').write_text(css.replace('/assets/','./'),'utf-8')
for file in D.rglob('*.html'):
    if file.name=='qa.html':continue
    rel=file.relative_to(D);target=O/rel;target.parent.mkdir(parents=True,exist_ok=True);s=file.read_text('utf-8')
    if 'id="catalog-grid"' in s:s=s.replace('</body>','<script type="application/json" id="ll-catalog-data">'+data+'</script></body>')
    def local(m):
        attr,value=m[1],m[2];page,sep,frag=value.partition('#');url,qs,query=page.partition('?');f=O/url.lstrip('/')
        if url.endswith('/') or not url:f=f/'index.html'
        loc=os.path.relpath(f,target.parent).replace('\\','/')
        return attr+'="'+loc+(qs+query if qs else '')+(sep+frag if sep else '')+'"'
    s=re.sub(r'(href|src|data-src)="(/[^"\s]*)"',local,s)
    target.write_text(s,'utf-8')
print('Tilda embeds, hybrid sections, native CTA links, and offline preview generated.')
print('Asset mode: '+('HTTPS CDN' if opt.asset_base or assetmap else 'self-contained data URLs for review'))
