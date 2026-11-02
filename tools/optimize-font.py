"""Optional publishing optimization. Requires fonttools and brotli in .build-deps."""
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools/.build-deps'))
from fontTools import subset
from fontTools.ttLib import TTFont

assets = ROOT / 'dist/assets'
font = TTFont(assets / 'InterVariable.woff2')
options = subset.Options()
options.flavor = 'woff2'
options.recalc_timestamp = False
subsetter = subset.Subsetter(options=options)
# Latin, Cyrillic (including Kazakh), punctuation, currency and interface symbols.
unicodes = set(range(0x20, 0x180)) | set(range(0x400, 0x530))
unicodes |= set(range(0x2000, 0x2070)) | set(range(0x20A0, 0x20D0))
unicodes |= set(range(0x2190, 0x2200)) | {0x2713, 0x2715, 0x2212}
subsetter.populate(unicodes=unicodes)
subsetter.subset(font)
font.save(assets / 'Inter-LegacyLab.woff2')
css = assets / 'site.css'
css.write_text(css.read_text('utf-8').replace('InterVariable.woff2', 'Inter-LegacyLab.woff2'), 'utf-8')
print('Subset font:', (assets / 'Inter-LegacyLab.woff2').stat().st_size, 'bytes')
