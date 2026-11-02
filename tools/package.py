from pathlib import Path
import zipfile,hashlib
R=Path(__file__).resolve().parents[1]
out=R.parent/'LegacyLab-Tilda-kit.zip'
skip={'node_modules','__pycache__','.git','.build-deps'}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=7) as z:
    for f in sorted(R.rglob('*')):
        if f.is_file() and not any(part in skip for part in f.relative_to(R).parts):
            z.write(f,'LegacyLab/'+f.relative_to(R).as_posix())
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert 'LegacyLab/offline/index.html' in z.namelist()
    assert 'LegacyLab/docs/03-tilda.md' in z.namelist()
print(str(out));print('Archive verified; '+str(out.stat().st_size)+' bytes')
