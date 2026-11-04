#!/usr/bin/env python3
"""Génère les QR codes du site AURA à partir de site/assets/data/config.json.

Usage :
    pip install segno
    python3 tools/generate_qr.py

Sorties dans site/assets/qr/ :
    <id>.svg       QR code vectoriel (affiches, site)
    <id>.png       QR code bitmap haute définition (Canva, Word, PowerPoint)
    manifest.json  liste lue par la page qr.html

Un QR code n'est créé que si la donnée existe : pas d'adresse support ou pas
d'URL de réseau social dans la config, pas de QR code correspondant.
"""

import json
import sys
from pathlib import Path

try:
    import segno
except ImportError:
    sys.exit("Le module 'segno' est requis : pip install segno")

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "site" / "assets" / "data" / "config.json"
OUT = ROOT / "site" / "assets" / "qr"

DARK = "#1d1d1f"
LIGHT = "#ffffff"


def build_entries(cfg):
    """Liste des QR codes à produire : (id, titre, sous-titre, contenu)."""
    base = cfg["siteUrl"].rstrip("/") + "/"
    entries = [
        {
            "id": "site",
            "title": "Notre site",
            "subtitle": "Découvrez AURA",
            "data": base,
        },
        {
            "id": "satisfaction",
            "title": "Votre avis",
            "subtitle": "30 secondes, sans inscription",
            # Le paramètre src permet de distinguer les réponses venues du QR code.
            "data": base + "satisfaction.html?src=qr",
        },
    ]
    if cfg.get("supportEmail"):
        entries.append({
            "id": "support",
            "title": "Support",
            "subtitle": cfg["supportEmail"],
            "data": "mailto:" + cfg["supportEmail"],
        })
    for s in cfg.get("socials", []):
        if s.get("url"):
            entries.append({
                "id": "social-" + s["id"],
                "title": s["label"],
                "subtitle": "Suivez-nous",
                "data": s["url"],
            })
    return entries


def main():
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)

    entries = build_entries(cfg)
    keep = set()
    for e in entries:
        # Niveau de correction "Q" (25 %) : le QR reste lisible s'il est un peu
        # abîmé ou imprimé sur une affiche froissée.
        qr = segno.make(e["data"], error="q", micro=False)
        svg = OUT / f"{e['id']}.svg"
        png = OUT / f"{e['id']}.png"
        qr.save(svg, kind="svg", scale=10, border=4, dark=DARK, light=LIGHT,
                xmldecl=False, svgns=True, title=f"QR code AURA - {e['title']}")
        # segno n'écrit pas de viewBox : sans lui, le navigateur rogne le QR
        # au lieu de le redimensionner quand on change sa taille en CSS.
        size = qr.symbol_size(scale=10, border=4)[0]
        txt = svg.read_text(encoding="utf-8")
        svg.write_text(txt.replace("<svg ", f'<svg viewBox="0 0 {size} {size}" ', 1), encoding="utf-8")
        qr.save(png, kind="png", scale=24, border=4, dark=DARK, light=LIGHT)
        e["svg"] = f"assets/qr/{svg.name}"
        e["png"] = f"assets/qr/{png.name}"
        keep.update({svg.name, png.name})
        print(f"  {e['id']:<20} {e['data']}")

    # Supprime les QR codes devenus obsolètes (réseau retiré de la config...).
    for f in OUT.iterdir():
        if f.suffix in {".svg", ".png"} and f.name not in keep:
            f.unlink()
            print(f"  supprimé : {f.name}")

    (OUT / "manifest.json").write_text(
        json.dumps({"generated": entries}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"{len(entries)} QR code(s) générés dans {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
